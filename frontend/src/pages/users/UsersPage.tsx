import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { api } from '@/service/api'
import { currentUser, type SessionUser } from '@/service/authService'
import { Button } from '@/components/Button'
import { TextField } from '@/components/TextField'

interface Profile {
  id: string
  nome: string
  codigo: string | null
}
interface User {
  id: string
  nome: string
  email: string
  perfis?: { id: string; nome: string }[]
  permissoes?: string[]
}
interface Delegation {
  usuarios: User[]
  permissoesDisponiveis: string[]
}
const LABELS: Record<string, string> = {
  'veiculos:ler': 'Consultar veículos',
  'veiculos:gerenciar': 'Criar, editar e excluir veículos',
  'motoristas:ler': 'Consultar motoristas',
  'motoristas:gerenciar': 'Criar, editar e excluir motoristas',
  'manutencoes:ler': 'Consultar manutenções',
  'manutencoes:gerenciar': 'Criar, editar e excluir manutenções',
}

export function UsersPage() {
  const [actor, setActor] = useState<SessionUser | null>(null)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [delegation, setDelegation] = useState<Delegation>({
    usuarios: [],
    permissoesDisponiveis: [],
  })
  const [selected, setSelected] = useState('')
  const [membership, setMembership] = useState({ usuario_id: '', perfil_id: '' })
  const [permissions, setPermissions] = useState<string[]>([])
  const [form, setForm] = useState({ nome: '', email: '', password: '', perfil_id: '' })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const me = await currentUser()
    setActor(me)
    if (me.permissoes.includes('usuarios:gerenciar')) {
      const [allUsers, allProfiles] = await Promise.all([
        api<User[]>('/usuarios'),
        api<{ message: Profile[] }>('/perfis'),
      ])
      setUsers(allUsers)
      setProfiles(
        allProfiles.message.filter(
          (p) => !['gestor_svo', 'atendente_svo'].includes(p.codigo ?? ''),
        ),
      )
    }
    if (me.permissoes.includes('usuarios:delegar-permissoes'))
      setDelegation(await api<Delegation>('/usuarios/auxiliares'))
  }, [])

  useEffect(() => {
    Promise.resolve()
      .then(load)
      .catch((cause: Error) => setError(cause.message))
      .finally(() => setLoading(false))
  }, [load])

  async function create(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')
    try {
      await api('/usuarios', { method: 'POST', body: JSON.stringify(form) })
      setForm({ nome: '', email: '', password: '', perfil_id: '' })
      await load()
      setMessage('Usuário criado.')
    } catch (cause) {
      setError((cause as Error).message)
    } finally {
      setSaving(false)
    }
  }

  async function changeProfile(removing: boolean) {
    setSaving(true)
    setError('')
    setMessage('')
    try {
      await api(`/usuarios/${membership.usuario_id}/perfis`, {
        method: removing ? 'DELETE' : 'POST',
        body: JSON.stringify({ perfil_id: membership.perfil_id }),
      })
      await load()
      setMessage(removing ? 'Perfil removido.' : 'Perfil atribuído.')
    } catch (cause) {
      setError((cause as Error).message)
    } finally {
      setSaving(false)
    }
  }

  async function savePermissions(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')
    try {
      await api(`/usuarios/${selected}/permissoes`, {
        method: 'PUT',
        body: JSON.stringify({ permissoes: permissions }),
      })
      await load()
      setMessage('Permissões atualizadas.')
    } catch (cause) {
      setError((cause as Error).message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <output>Carregando usuários…</output>
  const canCreate = actor?.permissoes.includes('usuarios:gerenciar')
  const canDelegate = actor?.permissoes.includes('usuarios:delegar-permissoes')

  return (
    <section>
      <h1>Usuários e permissões</h1>
      {error && <p role="alert">{error}</p>}
      {message && <output>{message}</output>}
      {!canCreate && !canDelegate && (
        <p>Seu usuário não possui acesso à gestão de usuários.</p>
      )}
      {canCreate && (
        <>
          <h2>Criar usuário</h2>
          <form onSubmit={create}>
            <TextField
              id="user-name"
              label="Nome"
              value={form.nome}
              onChange={(nome) => setForm({ ...form, nome })}
              disabled={saving}
            />
            <TextField
              id="user-email"
              label="E-mail"
              type="email"
              value={form.email}
              onChange={(email) => setForm({ ...form, email })}
              disabled={saving}
            />
            <TextField
              id="user-password"
              label="Senha inicial (mínimo de 12 caracteres)"
              type="password"
              value={form.password}
              onChange={(password) => setForm({ ...form, password })}
              disabled={saving}
            />
            <label htmlFor="user-profile">Perfil</label>
            <select
              id="user-profile"
              required
              value={form.perfil_id}
              disabled={saving}
              onChange={(e) => setForm({ ...form, perfil_id: e.target.value })}
            >
              <option value="">Selecione</option>
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
            <Button type="submit" isLoading={saving}>
              Criar usuário
            </Button>
          </form>
          <h2>Alterar perfis de um usuário</h2>
          <label htmlFor="membership-user">Usuário</label>
          <select
            id="membership-user"
            value={membership.usuario_id}
            disabled={saving}
            onChange={(e) => setMembership({ ...membership, usuario_id: e.target.value })}
          >
            <option value="">Selecione</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nome} — {u.email}
              </option>
            ))}
          </select>
          <label htmlFor="membership-profile">Perfil a atribuir ou remover</label>
          <select
            id="membership-profile"
            value={membership.perfil_id}
            disabled={saving}
            onChange={(e) => setMembership({ ...membership, perfil_id: e.target.value })}
          >
            <option value="">Selecione</option>
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
          <Button
            disabled={saving || !membership.usuario_id || !membership.perfil_id}
            onClick={() => changeProfile(false)}
          >
            Atribuir perfil
          </Button>
          <Button
            variant="secondary"
            disabled={saving || !membership.usuario_id || !membership.perfil_id}
            onClick={() => changeProfile(true)}
          >
            Remover perfil
          </Button>
          <h2>Usuários cadastrados</h2>
          {users.length ? (
            <ul>
              {users.map((u) => (
                <li key={u.id}>
                  {u.nome} — {u.email}{' '}
                  {u.perfis?.length ? `(${u.perfis.map((p) => p.nome).join(', ')})` : ''}
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhum usuário cadastrado.</p>
          )}
        </>
      )}
      {canDelegate && (
        <>
          <h2>Acessos dos auxiliares</h2>
          <p>Selecione os acessos que o auxiliar poderá executar diretamente.</p>
          {!delegation.usuarios.length ? (
            <p>
              Nenhum auxiliar disponível. O administrador precisa cadastrar um usuário com
              o perfil Auxiliar de Gestor.
            </p>
          ) : (
            <form onSubmit={savePermissions}>
              <label htmlFor="assistant-user">Auxiliar</label>
              <select
                id="assistant-user"
                required
                value={selected}
                disabled={saving}
                onChange={(e) => {
                  setSelected(e.target.value)
                  setPermissions(
                    delegation.usuarios.find((u) => u.id === e.target.value)
                      ?.permissoes ?? [],
                  )
                }}
              >
                <option value="">Selecione</option>
                {delegation.usuarios.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nome} — {u.email}{' '}
                    {u.perfis?.length
                      ? `(${u.perfis.map((p) => p.nome).join(', ')})`
                      : ''}
                  </option>
                ))}
              </select>
              <fieldset disabled={!selected || saving}>
                <legend>Permissões operacionais</legend>
                {delegation.permissoesDisponiveis.map((p) => (
                  <div key={p}>
                    <label>
                      <input
                        type="checkbox"
                        checked={permissions.includes(p)}
                        onChange={(e) =>
                          setPermissions((old) =>
                            e.target.checked
                              ? [...old, p]
                              : old.filter((value) => value !== p),
                          )
                        }
                      />{' '}
                      {LABELS[p] ?? p}
                    </label>
                  </div>
                ))}
              </fieldset>
              <Button type="submit" disabled={!selected} isLoading={saving}>
                Salvar permissões
              </Button>
            </form>
          )}
        </>
      )}
    </section>
  )
}
