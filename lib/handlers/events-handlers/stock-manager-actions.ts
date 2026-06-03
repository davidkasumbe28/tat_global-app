// import api from "@/lib/api";

// // ----------------------- handle stock manager collection action ---------------------------

// async function handleCreateCollection(formData: Record<string, any>) {
//   try {
//     const res = await api.post("/stock-manager/collections", formData);
//     return res as Record<string, any>;
//   } catch (error) {
//     const err = error as Error;
//     const message = err.message;
//     return { error: message } as Record<string, any>;
//   }
// }

// async function handleGetCollections(page: string, limit: string) {
//   try {
//     const res = await api.get(
//       "/stock-manager/collections?" + "page=" + page + "&limit=" + limit
//     );
//     return res as Record<string, any>;
//   } catch (error) {
//     const err = error as Error;
//     const message = err.message;
//     return { error: message } as Record<string, any>;
//   }
// }

// async function handleGetCollection(id: number) {
//   try {
//     const res = await api.get("/stock-manager/collections/" + id);
//     return res as Record<string, any>;
//   } catch (error) {
//     const err = error as Error;
//     const message = err.message;
//     return { error: message } as Record<string, any>;
//   }
// }

// async function handleUpdateCollection(
//   id: number,
//   formData: Record<string, any>
// ) {
//   try {
//     const res = await api.patch("/stock-manager/collections/" + id, formData);
//     return res as Record<string, any>;
//   } catch (error) {
//     const err = error as Error;
//     const message = err.message;
//     return { error: message } as Record<string, any>;
//   }
// }

// async function handleUploadCollectionImage(
//   id: number,
//   file: File,
//   setProgress: React.Dispatch<React.SetStateAction<number>>,
//   setUploading: React.Dispatch<React.SetStateAction<boolean>>,
//   inputRef: React.RefObject<HTMLInputElement | null>,
//   setError: React.Dispatch<React.SetStateAction<string>>
// ): Promise<Record<string, any>> {
//   try {
//     // Reset état de progression
//     setProgress(0);

//     const xhr = new XMLHttpRequest();
//     const form = new FormData();
//     form.append("file", file);

//     // Suivi de progression
//     xhr.upload.onprogress = (event) => {
//       if (event.lengthComputable) {
//         const percent = Math.round((event.loaded / event.total) * 100);
//         setProgress(percent);
//       }
//     };

//     xhr.onload = () => {
//       setUploading(false);
//       setProgress(100);

//       try {
//         const res = JSON.parse(xhr.responseText);
//         return res;
//       } catch (err) {
//         console.error("Erreur parsing JSON:", err);
//         setError("Erreur lors de l'analyse de la réponse du serveur");
//       }

//       if (inputRef.current) inputRef.current.value = "";
//     };

//     xhr.onerror = () => {
//       console.error("Upload failed");
//       setError("Échec de l'upload de l' image");
//       setUploading(false);
//       if (inputRef.current) inputRef.current.value = "";
//     };

//     xhr.open("POST", "/api/stock-manager/collections/" + id);
//     xhr.send(form);

//     return {} as Record<string, any>;
//   } catch (error) {
//     const err = error as Error;
//     const message = err.message;
//     return { error: message } as Record<string, any>;
//   }
// }

// // ----------------------- handle stock manager product action ---------------------------

// async function handleCreateProduct(formData: Record<string, any>) {
//   try {
//     const res = await api.post("/stock-manager/products", formData);
//     return res as Record<string, any>;
//   } catch (error) {
//     const err = error as Error;
//     const message = err.message;
//     return { error: message } as Record<string, any>;
//   }
// }

// async function handleGetProducts(page: string, limit: string) {
//   try {
//     const res = await api.get(
//       "/stock-manager/products?" + "page=" + page + "&limit=" + limit
//     );
//     return res as Record<string, any>;
//   } catch (error) {
//     const err = error as Error;
//     const message = err.message;
//     return { error: message } as Record<string, any>;
//   }
// }

// async function handleGetProduct(id: number) {
//   try {
//     const res = await api.get("/stock-manager/products/" + id);
//     return res as Record<string, any>;
//   } catch (error) {
//     const err = error as Error;
//     const message = err.message;
//     return { error: message } as Record<string, any>;
//   }
// }

// async function handleUpdateProduct(id: number, formData: Record<string, any>) {
//   try {
//     const res = await api.patch("/stock-manager/products/" + id, formData);
//     return res as Record<string, any>;
//   } catch (error) {
//     const err = error as Error;
//     const message = err.message;
//     return { error: message } as Record<string, any>;
//   }
// }

// async function handleUploadProductImage(
//   id: number,
//   file: File,
//   setProgress: React.Dispatch<React.SetStateAction<number>>,
//   setUploading: React.Dispatch<React.SetStateAction<boolean>>,
//   inputRef: React.RefObject<HTMLInputElement | null>,
//   setError: React.Dispatch<React.SetStateAction<string>>
// ): Promise<Record<string, any>> {
//   try {
//     // Reset état de progression
//     setProgress(0);

//     const xhr = new XMLHttpRequest();
//     const form = new FormData();
//     form.append("file", file);

//     // Suivi de progression
//     xhr.upload.onprogress = (event) => {
//       if (event.lengthComputable) {
//         const percent = Math.round((event.loaded / event.total) * 100);
//         setProgress(percent);
//       }
//     };

//     xhr.onload = () => {
//       setUploading(false);
//       setProgress(100);

//       try {
//         const res = JSON.parse(xhr.responseText);
//         return res;
//       } catch (err) {
//         console.error("Erreur parsing JSON:", err);
//         setError("Erreur lors de l'analyse de la réponse du serveur");
//       }

//       if (inputRef.current) inputRef.current.value = "";
//     };

//     xhr.onerror = () => {
//       console.error("Upload failed");
//       setError("Échec de l'upload de l' image");
//       setUploading(false);
//       if (inputRef.current) inputRef.current.value = "";
//     };

//     xhr.open("POST", "/api/stock-manager/products/" + id);
//     xhr.send(form);

//     return {} as Record<string, any>;
//   } catch (error) {
//     const err = error as Error;
//     const message = err.message;
//     return { error: message } as Record<string, any>;
//   }
// }

// // ----------------------- handle stock manager order action ---------------------------

// async function handleGetOrders(page: string, limit: string) {
//   try {
//     const res = await api.get(
//       "/stock-manager/orders?" + "page=" + page + "&limit=" + limit
//     );
//     return res as Record<string, any>;
//   } catch (error) {
//     const err = error as Error;
//     const message = err.message;
//     return { error: message } as Record<string, any>;
//   }
// }

// async function handleGetOrder(id: number) {
//   try {
//     const res = await api.get("/stock-manager/orders/" + id);
//     return res as Record<string, any>;
//   } catch (error) {
//     const err = error as Error;
//     const message = err.message;
//     return { error: message } as Record<string, any>;
//   }
// }

// async function handleUpdateOrder(id: number, formData: Record<string, any>) {
//   try {
//     const res = await api.patch("/stock-manager/orders/" + id, formData);
//     return res as Record<string, any>;
//   } catch (error) {
//     const err = error as Error;
//     const message = err.message;
//     return { error: message } as Record<string, any>;
//   }
// }

// // ----------------------- handle stock manager delivery person action ---------------------------

// async function handleGetDeliveryMen() {
//   try {
//     const res = await api.get("/stock-manager/delivery-person");
//     return res as Record<string, any>;
//   } catch (error) {
//     const err = error as Error;
//     const message = err.message;
//     return { error: message } as Record<string, any>;
//   }
// }

// async function handleGetCustomers(page: string, limit: string) {
//   try {
//     const res = await api.get(
//       "/admin/customers?" + "page=" + page + "&limit=" + limit
//     );
//     return res as Record<string, any>;
//   } catch (error) {
//     const err = error as Error;
//     const message = err.message;
//     return { error: message } as Record<string, any>;
//   }
// }

// async function handleGetCustomer(id: number) {
//   try {
//     const res = await api.get("/admin/customers/" + id);
//     return res as Record<string, any>;
//   } catch (error) {
//     const err = error as Error;
//     const message = err.message;
//     return { error: message } as Record<string, any>;
//   }
// }

// export {
//   handleCreateCollection,
//   handleCreateProduct,
//   handleGetCollection,
//   handleGetCollections,
//   handleGetDeliveryMen,
//   handleGetOrder,
//   handleGetOrders,
//   handleGetProduct,
//   handleGetProducts,
//   handleUpdateCollection,
//   handleUpdateOrder,
//   handleUpdateProduct,
//   handleUploadCollectionImage,
//   handleUploadProductImage,
// };
