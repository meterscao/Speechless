import axios from "axios"

const UserInfoApiPath = `https://weibo.com/ajax/profile/info`
const UserBlogHistoryApiPath = `https://weibo.com/ajax/profile/mbloghistory`

const _getIDFromURL = function () {
  let id
  let idfrom
  let url = decodeURIComponent(location.href)

  if (!id) {
    // https://weibo.com/u/1738498871
    let regRes = url.match(/weibo.com\/u\/*(\w+)/)
    if (regRes && regRes.length > 1) {
      id = regRes.pop()
      idfrom = "uid"
    }
  }

  if (!id) {
    // https://weibo.com/n/%E6%83%A0%E8%8B%B1%E7%B4%85kara
    let regRes = url.match(/https:\/\/weibo\.com\/n\/([\w一-龥]+)/)
    if (regRes && regRes.length > 1) {
      id = regRes.pop()
      idfrom = "screen_name"
    }
  }

  if (!id) {
    // https://weibo.com/sandra0314
    let regRes = url.match(/weibo.com\/(\w+)/)
    if (regRes && regRes.length > 1) {
      id = regRes.pop()
      idfrom = "custom"
    }
  }
  console.log("id from url is: ", id)
  return {
    idfrom,
    id,
  }
}

const _fetchBlogHistory = async function (uid) {
  if (uid) {
    let historyResp = await axios.get(UserBlogHistoryApiPath, {
      params: {
        uid: uid,
      },
    })
    try {
      let yearMap = historyResp.data.data
      console.log("yearMap", yearMap)
      return yearMap
    } catch (error) {
      console.error(error)
      return
    }
  } else {
    return
  }
}

export const fetchUserInfo = async function () {
  let { id, idfrom } = _getIDFromURL()

  if (id) {
    let parm = {}
    parm[idfrom] = id
    let userResp = await axios.get(UserInfoApiPath, {
      params: parm,
    })

    try {
      let uid = userResp.data.data.user.id
      let username = userResp.data.data.user.screen_name
      console.log("uid", uid)
      console.log("username", username)
      let history = await _fetchBlogHistory(uid)

      return {
        id,
        uid,
        username,
        history,
      }
    } catch (error) {
      console.error(error)
      return
    }
  } else {
    return
  }
}
