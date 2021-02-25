export function menuEvent(e, btnId) {
  switch (btnId) {
    case 'btnFirstPerson':
      handleFirstPerson()
      break

    default:
      break
  }
}
export function handleFirstPerson() {
  console.info('第一人称巡检', this.controls)
}
