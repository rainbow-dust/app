import Avatar from '~/components/Avatar'

import { UserInfo } from '../BaseInfo'

export const PeopleList = ({
  peopleList,
  toggle,
}: {
  peopleList: UserInfo[]
  toggle: () => void
}) => {
  // 这里之后再做的话..肯定要做成内部再请求的形式，为获取查的用户是否关注当前用户等信息
  // 这一次先只改造成 pop list
  return (
    <div>
      {peopleList.map((people) => (
        <div
          key={people.username}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px 0',
            borderBottom: '1px solid #e6e6e6',
          }}
          onClick={toggle}
        >
          <Avatar
            imageUrl={
              import.meta.env.VITE_FURINA_APP_IMG_URL + people.avatar_url
            }
            altText={people.username}
            size={20}
            peopleLink={`/people/${people.username}`}
          />
          {people.username}
        </div>
      ))}
    </div>
  )
}
