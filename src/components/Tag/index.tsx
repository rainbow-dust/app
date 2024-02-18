export const Tag: React.FC<{
  name: string
  onClick: () => void
  active: boolean
}> = ({ name, onClick, active }) => {
  return (
    <span
      onClick={onClick}
      style={{
        padding: '4px 12px',
        margin: '0 8px 8px 0',
        borderRadius: '16px',
        fontSize: '16px',
        backgroundColor: 'var(--bg-color)',
        color: active ? 'var(--theme-color)' : 'var(--text-color)',
        cursor: 'pointer',
      }}
    >
      {name}
    </span>
  )
}
