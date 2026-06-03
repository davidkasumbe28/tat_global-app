"use server";

import { put } from "@vercel/blob";
import logs from "../../../lib/utils/logs";
import { updateProfileUser } from "../services/user.service";
// import {
//   updateStockManagerCollectionAction,
//   updateStockManagerProductAction,
// } from "../actions/stock-manager";

async function putAvatarAction(fileName: string, buffer: Buffer<ArrayBuffer>) {
  try {
    const uploaded = await put("avatars/" + fileName, buffer);

    if (!uploaded)
      return {
        success: false,
        error: "Votre avatar n'a pas été télécharger, veuillez réesseyer",
      };

    return { success: true, url: uploaded.url };
  } catch (error) {
    console.log("PutAvatar error : ", error);
    return {
      success: false,
      error: logs.error.vercelBlob.avatar,
    };
  }
}

export async function updateAvatarAction(
  claims: string | null,
  file: File,
): Promise<{ success: boolean; state?: boolean; error?: string }> {
  try {
    const payload = JSON.parse(claims || "");

    const user = {
      id: payload?.userId,
    };

    const { id } = user;

    const fileName = "user-avatar@" + id;

    const uploaded = await put("avatars/" + fileName, file, {
      access: "public",
      allowOverwrite: true,
    });

    if (!uploaded)
      return {
        success: false,
        error: "Image de l'utilisateur non enregistrée",
      };

    return await updateProfileUser(claims as string, {
      avatar: uploaded.url,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("UpdateProfile error:", error);
    return {
      success: false,
      error: "Erreur lors de la mise à jour du profil",
    };
  }
}

// export async function updateCollectionImageAction(
//   id: number,
//   file: File,
// ): Promise<{ success: boolean; state?: boolean; error?: string }> {
//   try {
//     const fileName = "collection-image@" + id;

//     const uploaded = await put("images/collections/" + fileName, file, {
//       access: "public",
//       addRandomSuffix: true,
//     });

//     if (!uploaded)
//       return {
//         success: false,
//         error: "Image de la collection non enregistrée",
//       };

//     return await updateStockManagerCollectionAction(id, {
//       image: uploaded.url,
//       updatedAt: new Date(),
//     });
//   } catch (error) {
//     console.error("UpdateCollectionImage error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la mise à jour de la collection",
//     };
//   }
// }

// export async function updateProductImageAction(
//   id: number,
//   file: File,
// ): Promise<{ success: boolean; state?: boolean; error?: string }> {
//   try {
//     const fileName = "product-image@" + id;

//     const uploaded = await put("images/products/" + fileName, file, {
//       access: "public",
//       addRandomSuffix: true,
//     });

//     if (!uploaded)
//       return { success: false, error: "Image du produit non enregistrée" };

//     return await updateStockManagerProductAction(id, {
//       image: uploaded.url,
//       updatedAt: new Date(),
//     });
//   } catch (error) {
//     console.error("UpdateProductImage error:", error);
//     return {
//       success: false,
//       error: "Erreur lors de la mise à jour du produit",
//     };
//   }
// }

// // function validatePhone(phone: string): boolean {
// //   const regex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
// //   return regex.test(phone.replace(/\s/g, ""));
// // }

export { putAvatarAction };

