import cx from 'classnames'

export default ({ children, title, ...props }) => {
  const classList = cx('modal', {
    large: props.large,
  })

  function closeModal(e) {
    props.onClose()
  }

  if (!props.open) {
    return <></>
  }
  return (
    <>
      <div className="modal-wrapper" onClick={closeModal}>
        <div className={classList} onClick={(e) => e.stopPropagation()}>
          <div className="header">{title}</div>
          <div className="body">{children}</div>
        </div>
      </div>
      <style jsx>
        {`
          .modal-wrapper {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            width: 100vw;
            background: rgba(12, 12, 12, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .modal {
            background: #fff;
            height: auto;
            width: 450px;
            box-shadow: 0px 2px 8px rgba(12, 12, 13, 0.1);
            border-radius: 4px;
            max-height: calc(100vh - 210px);
            overflow-y: auto;
          }

          .modal .header {
            padding: 12px 8px;
            text-align: center;
            border-bottom: 1px solid rgba(12, 12, 13, 0.1);
          }

          .modal .body {
            padding: 8px;
          }
        `}
      </style>
    </>
  )
}
