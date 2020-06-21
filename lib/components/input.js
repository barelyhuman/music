export default (props) => {
  return (
    <>
      <div className="input-wrapper">
        <input {...props} />
      </div>
      <style jsx>
        {`
          .input-wrapper,
          .input-wrapper input {
            width: 100%;
            box-sizing: border-box;
          }

          input {
            outline: none;
            border: 2px solid rgba(12, 12, 13, 0.1);
            height: 40px;
            font-size: 16px;
            width: 80%;
            border-radius: 4px;
            margin: 0 auto;
            padding: 4px;
          }

          input:focus {
            border-color: #000;
          }
        `}
      </style>
    </>
  )
}
