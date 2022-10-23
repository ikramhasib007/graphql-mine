export default function notificationTemplate(author, type) {
  let text = getText(type);
  
  return (
    `<span class="flex-shrink-0 inline-block relative">
      <img class="h-10 w-10 rounded-full" src=${author.imageUrl} alt="" />
      <span class="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full" aria-hidden="true"></span>
    </span>
    <div class="ml-4 truncate">
      <p class="text-sm w-46 sm:w-60.5 font-medium text-gray-900 truncate">${author.name}</p>
      <p class="text-sm line-clamp-2 text-gray-500 whitespace-pre-line">${text}</p>
    </div>`
  )
}

// has published a new blog post.
// also commented on a post in...
// commented on your post.
// replied to your comment.
// shared your post.
// likes your post.
// reacted to your post.
// reacted to a post you shared.
// following you.

function getText(type) {
  switch (type) {
    case 'newPost':
      return 'has published a new blog post.'

    case 'ownPost':
      return 'The post has been published. It can be viewed by anyone who has the link.'
      // post published & it is publicly accessible.

    case 'comment':
      return 'commented on your post.'

    case 'alsoComment':
      return 'also commented on a post in...'

    case 'replied':
      return 'replied to your comment.'

    case 'like':
      return 'likes your post.'

    case 'shared':
      return 'shared your post.'

    case 'reactedToPost':
      return 'reacted to your post.'
      
    case 'reactedToSharedPost':
      return 'reacted to a post you shared.'

    case 'follow':
      return 'following you'

    default:
      return 'commented on your post.'
  }
}
