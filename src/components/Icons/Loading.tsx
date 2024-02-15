import Classes from './Loading.module.css'

export const IconLoading = () => {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div className={Classes.loading}></div>
    </div>
  )
}
