import axios from "axios"

const GetLongTextURL = `https://weibo.com/ajax/statuses/longtext`

export const fetchLongText = async function(postid){
    let longTextResp = await axios.get(GetLongTextURL,{
        params:{
            id: postid
        }
    })

    try {
        return longTextResp.data
    } catch (error) {
        return 
    }
}