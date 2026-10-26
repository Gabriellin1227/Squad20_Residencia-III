import { useEffect, useState, type FormEvent } from 'react'
import { Button } from '@/components/Button'
import { TextField } from '@/components/TextField'
import { currentUser, type SessionUser } from '@/service/authService'
import { api } from '@/service/api'
import styles from './ProfilePage.module.scss'

export default function ProfilePage() {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmation: '',
  })
  useEffect(() => {
    currentUser()
      .then(setUser)
      .catch((cause: Error) => setError(cause.message))
  }, [])

  async function changePassword(event: FormEvent) {
    event.preventDefault()
    setError('')
    setMessage('')
    if (form.newPassword !== form.confirmation) {
      setError('As senhas não coincidem.')
      return
    }
    setSaving(true)
    try {
      await api('/auth/password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      })
      setForm({ currentPassword: '', newPassword: '', confirmation: '' })
      setMessage('Senha alterada. Outras sessões foram encerradas.')
    } catch (cause) {
      setError((cause as Error).message)
    } finally {
      setSaving(false)
    }
  }
  return (
    <div className={styles.page}>
      <div>
        <h1 className={styles.title}>Perfil de Usuário</h1>
        {error && <p role="alert">{error}</p>}
        {message && <output>{message}</output>}
        {user ? (
          <section className={styles.detailsCard}>
            <h2 className={styles.sectionTitle}>Dados Cadastrais</h2>
            <dl>
              <dt>Nome</dt>
              <dd>{user.nome}</dd>
              <dt>E-mail</dt>
              <dd>{user.email}</dd>
            </dl>
            <h2 className={styles.sectionTitle}>Permissões</h2>
            {user.permissoes.length ? (
              <ul>
                {user.permissoes.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            ) : (
              <p>Nenhuma permissão atribuída.</p>
            )}
            <h2 className={styles.sectionTitle}>Alterar senha</h2>
            <form onSubmit={changePassword}>
              <TextField
                id="current-password"
                label="Senha atual"
                type="password"
                autoComplete="current-password"
                value={form.currentPassword}
                onChange={(currentPassword) => setForm({ ...form, currentPassword })}
                disabled={saving}
                required
              />
              <TextField
                id="new-password"
                label="Nova senha"
                type="password"
                autoComplete="new-password"
                value={form.newPassword}
                onChange={(newPassword) => setForm({ ...form, newPassword })}
                disabled={saving}
                minLength={12}
                required
              />
              <TextField
                id="confirm-password"
                label="Confirme a nova senha"
                type="password"
                autoComplete="new-password"
                value={form.confirmation}
                onChange={(confirmation) => setForm({ ...form, confirmation })}
                disabled={saving}
                minLength={12}
                required
              />
              <Button type="submit" isLoading={saving}>
                Salvar senha
              </Button>
            </form>
          </section>
        ) : (
          !error && <output>Carregando perfil…</output>
        )}
      </div>
    </div>
  )
}
