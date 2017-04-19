export const sendNotification = ({username, message, question_message}) => {
  let options = {
    body: `${username} replied: ${message}`
  }
  if (Notification.permission === 'granted') {
    let notification = new Notification(`${question_message}`, options)
    // onclick is not yet ready
    // notification.onclick = function (event) {
    //   event.preventDefault()
    //   console.log(`/question/${question_id}`)
    //   window.open(`/question/${question_id}`)
    // }
    setTimeout(notification.close.bind(notification), 5000)
  }
}
