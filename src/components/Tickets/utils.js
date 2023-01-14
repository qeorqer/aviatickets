export const convertMinutesIntoHours = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const minutesLeft = minutes % 60;

  return `${hours} hours ${minutesLeft} minutes`
}

export const checkIfLessThen10 = (value) => {
  if (value < 10) {
    return `0${value}`;
  }

  return value;
}
