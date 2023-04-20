import axios from "axios"

const UserInfoApiPath = `https://weibo.com/ajax/profile/info`
const UserBlogHistoryApiPath = `https://weibo.com/ajax/profile/mbloghistory`

const _getIDFromURL = function () {
  let id
  let url = location.href
  let regRes = url.match(/weibo.com\/(u\/)*(\w+)/)
  if (regRes && regRes.length > 1) {
    id = regRes.pop()
  }
  console.log("id from url is: ", id)
  return id
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
  let id = _getIDFromURL()

  if (id) {
    let userResp = await axios.get(UserInfoApiPath, {
      params: {
        custom: id,
      },
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
