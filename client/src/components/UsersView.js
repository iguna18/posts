import React from 'react'
import { Link } from "react-router-dom"

const UsersView = ({users}) => {
  return (
    <div>
      <h3>Users</h3>
      <table>
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
                    <Link to={`/users/${u.id}`}>@{u.username}</Link>
                  </td>
                  <td>
                    {u.blog_ids.length}
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
}

export {UsersView}