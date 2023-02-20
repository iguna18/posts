const MyInput = ({ value, setValue }) => (
  <input value={ value } onChange={ e => setValue(e.target.value) }></input>
)

export default MyInput