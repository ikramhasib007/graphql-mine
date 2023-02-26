import { useQuery } from '@apollo/client'
import { classNames } from '../../layout'
import { SUBSCRIBE_USER } from '../../operations/subscription'
import { GET_USERS } from '../../operations/user'
import LatestUser from './LatestUser'

function Users() {
  const { data, loading, subscribeToMore } = useQuery(GET_USERS)
  console.log('[Users] data, loading: ', data, loading);

  if (loading) return <p className='mt-8 px-6'>loading...</p>

  if (!data) return null

  return (
    <>
      <LatestUser
        subscribeToNewUser={() => subscribeToMore({
          document: SUBSCRIBE_USER,
          updateQuery: (prev, { subscriptionData }) => {
            console.log('[SUBSCRIBE_USER] subscriptionData: ', subscriptionData);
            if (!subscriptionData.data) return prev;

            let newUser = subscriptionData.data.user.data;
            if (subscriptionData.data.user.mutation === 'CREATED' && !prev.users.some(item => item.id === newUser.id)) {
              return Object.assign({}, prev, {
                users: [newUser, ...prev.users]
              })
            } else {
              return prev
            }
          }
        })}
      />

      {/* Projects table (small breakpoint and up) */}
      <div className="mt-8 hidden sm:block">
        <div className="inline-block min-w-full border-b border-gray-200 align-middle">
          <table className="min-w-full">
            <thead>
              <tr className="border-t border-gray-200">
                <th
                  className="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900"
                  scope="col"
                >
                  Name
                </th>
                <th
                  className="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900"
                  scope="col"
                >
                  Email
                </th>
                <th
                  className="hidden border-b border-gray-200 bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900 md:table-cell whitespace-nowrap"
                  scope="col"
                >
                  Last updated
                </th>
                <th
                  className="border-b border-gray-200 bg-gray-50 py-3 pr-6 text-right text-sm font-semibold text-gray-900"
                  scope="col"
                />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {data.users.map((user) => (
                <tr key={user.id}>
                  <td className="w-full max-w-0 whitespace-nowrap px-6 py-3 text-sm font-medium text-gray-900">
                    <div className="flex items-center space-x-3 lg:pl-2">
                      <div
                        className={classNames('bg-pink-600 flex-shrink-0 w-2.5 h-2.5 rounded-full')}
                        aria-hidden="true"
                      />
                      <a href="#" className="truncate hover:text-gray-600">
                        {user.name}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-500">
                    <span>{user.email}</span>
                  </td>
                  <td className="hidden whitespace-nowrap px-6 py-3 text-right text-sm text-gray-500 md:table-cell">
                    {user.udpatedAt}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-right text-sm font-medium">
                    <a href="#" className="text-indigo-600 hover:text-indigo-900">
                      Edit
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default Users