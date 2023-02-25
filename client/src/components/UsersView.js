import { Table } from "react-bootstrap"
import { Link } from "react-router-dom"

const UsersView = ({users}) => {
  return (
    <div>
      <h3>Users</h3>
      <Table striped>
        <thead>
          <tr>
            <th> </th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {
            users.map(u => {
              return (
                <tr key={u.id}>
                  <td>
                    <Link to={`/users/${u.id}`}>{u.name}</Link>
                  </td>
                  <td>
                    {u.blog_ids.length}
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </Table>
    </div>
  )
}

export {UsersView}