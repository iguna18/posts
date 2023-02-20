const totalLikes = (blogs) => {
  return blogs.reduce((sum, item) => sum + item.likes, 0)
}
//should aways return 1
const dummy = (blogs) => {
  return 1
}

const favouriteBlog = (blogs) => {
  if (blogs.length == 0)
    return {}
  
  const r = blogs.reduce((prev, cur) => cur.likes > prev.likes ? cur : prev)
  return {title:r.title, author:r.author, likes:r.likes}
}

const mostBlogs = (blogs) => {
  let names = []
  blogs.forEach(b => {
    let f = names.find(n => n.author === b.author)
    if(f) {
      f.blogs++
    } else {
      names.push({
        author:b.author,
        blogs:1
      })
    }
  })
  return names.reduce((prev, cur) => cur.blogs > prev.blogs ? cur : prev)
}

const mostLikes = (blogs) => {
  let names = []
  blogs.forEach(b => {
    let f = names.find(n => n.author === b.author)
    if(f) {
      f.likes += b.likes
    } else {
      names.push({
        author:b.author,
        likes:b.likes
      })
    }
  })
  return names.reduce((prev, cur) => cur.likes > prev.likes ? cur : prev)
}

module.exports = {
  dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes
}