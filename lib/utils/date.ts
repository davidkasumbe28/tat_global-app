import { CompareSigne } from "../@types/enums";

export function formatDate(
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  }
): string {
  return new Intl.DateTimeFormat("fr-FR", options).format(date).replace('.',"");
}


export function compareDate(a: Date | string, b: Date | string, compareSigne?: CompareSigne) {

  switch (compareSigne) {
    case CompareSigne["<"]:
      return new Date(a).getTime() < new Date(b).getTime()
    case CompareSigne[">"]:
      return new Date(a).getTime() > new Date(b).getTime()
    case CompareSigne["<="]:
      return new Date(a).getTime() <= new Date(b).getTime()
    case CompareSigne[">="]:
      return new Date(a).getTime() >= new Date(b).getTime()
    default:
      return new Date(a).getTime() === new Date(b).getTime()
  }

}