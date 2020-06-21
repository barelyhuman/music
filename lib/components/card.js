export default ({ children, ...props }) => {
  return (
    <>
      <div className="card-wrapper">{children}</div>
      <style jsx>
        {`
          .card-wrapper {
            background: #fff;
            border: 1px solid rgba(12, 12, 13, 1);
            box-shadow: 0px 1px 4px rgba(12, 12, 13, 0.1);
            border-radius: 4px;
            padding: 8px;
          }
        `}
      </style>
    </>
  )
}
