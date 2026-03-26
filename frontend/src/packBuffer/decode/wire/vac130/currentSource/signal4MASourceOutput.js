export function signal4MASourceOutput(responseMessage) {
  console.log(responseMessage)
  console.log('responseMessage !== 0106000001908836',responseMessage !== '0106000001908836')
  return responseMessage !== '0106000001908836';

}
