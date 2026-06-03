import { formatNumber } from "@/lib/utils/number";
import { acronyme } from "@/lib/utils/string";

type IGTType = "ORD" | "PRD" | "CLT" | "INV" | "DLY" | "TRS" | "ACT";

class Igt {
  // 0 1 2 3 4 5 6 7 8 9
  // A B C D E F G H I J
  // K L M N O P Q R S T
  // U V W X Y Z
  #typeCode: Record<IGTType, number[]> = {
    ORD: [4, 7, 3],
    PRD: [5, 7, 3],
    CLT: [4, 1, 9],
    INV: [8, 3, 1],
    DLY: [3, 1, 4],
    TRS: [9, 7, 8],
    ACT: [0, 2, 9],
  };

  constructor() {}

  generateSku(type: IGTType, id?: number, name?: string): string {
    if (!this.#typeCode[type]) {
      throw new Error(
        "Type de colis invalide. Les types valides sont ORD, PRD et CLT.",
      );
    }

    if (typeof id !== "number" || id <= 0) {
      throw new Error("L'ID utilisateur doit être un nombre entier positif.");
    }

    const uniqueId = (Math.random() * 100).toString(36).toUpperCase();

    const formatted = formatNumber(uniqueId, 8);

    const acro = acronyme(name as string);
    const sku = acro + "-" + formatted;
    return sku;
  }

  generateNumber(type: IGTType, id: number): string {
    if (!this.#typeCode[type]) {
      throw new Error(
        "Type de colis invalide. Les types valides sont ORD, PRD et CLT.",
      );
    }

    const uniqueId = (id * 100).toString(36).toUpperCase();

    const formatted = formatNumber(uniqueId, 8);

    const sku = type + "-" + formatted;
    return sku;
  }

  generateCode(id: number, type: IGTType): string {
    if (!this.#typeCode[type]) {
      throw new Error(
        "Type de colis invalide. Les types valides sont ORD et PRD.",
      );
    }

    const date = Date.now().toString();

    const seconds = new Date().getSeconds().toString();

    const code = this.#typeCode[type];

    const uniqueId = (id * 100).toString(36).toUpperCase();

    const number = code[0] + date + code[1] + seconds + code[2];

    const IGTCode = "#" + uniqueId + "-" + number;

    return IGTCode;
  }

  verifyCode(IGTCode: string): { id: number; verify: boolean } | false {
    const uniqueId = IGTCode.split("-")[0].slice(1);

    const id = parseInt(uniqueId, 36) / 100;

    const number = IGTCode.split("-")[1];

    const code = [
      parseInt(number[0]),
      parseInt(number[number.length - 4]),
      parseInt(number[number.length - 1]),
    ];

    const regex = new RegExp(
      `^#${uniqueId}-${code[0]}[1-9]\\d*${code[1]}\\d{2}${code[2]}$`,
    );

    const isValid = regex.test(IGTCode);

    if (!isValid) {
      return false;
    }

    const seconds = number.slice(-3, -1);

    const date = number.slice(1, -4);

    const isValidDate =
      !isNaN(new Date(Number(date)).getTime()) &&
      new Date(Number(date)).getSeconds() === parseInt(seconds);

    if (!isValidDate) {
      return false;
    }

    return { id, verify: true };
  }
}

export default Igt;
