export const sendNotification = ({user_id, message, question_id}) => {
  let question = 'How did you get this working?'
  let options = {
    body: `${user_id} replied:
  ${message}`
  }
  if (Notification.permission === 'granted') {
    let notification = new Notification(`${question}`, options)
    notification.onclick = function (event) {
      event.preventDefault()
      console.log(`/question/${question_id}`)
      window.open(`/question/${question_id}`)
    }
    setTimeout(notification.close.bind(notification), 5000)
  }
}
