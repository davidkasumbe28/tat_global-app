// import api from "@/lib/api";

// async function handleRegisterEmployee(formData: Record<string, any>) {
//   try {
//     const res = await api.post("/admin/employees", formData);
//     return res as Record<string, any>;
//   } catch (error) {
//     const err = error as Error;
//     const message = err.message;
//     return { error: message } as Record<string, any>;
//   }
// }

// async function handleGetEmployees(page: string, limit: string) {
//   try {
//     const res = await api.get(
//       "/admin/employees?" + "page=" + page + "&limit=" + limit
//     );
//     return res as Record<string, any>;
//   } catch (error) {
//     const err = error as Error;
//     const message = err.message;
//     return { error: message } as Record<string, any>;
//   }
// }

// async function handleGetEmployee(id: number) {
//   try {
//     const res = await api.get("/admin/employees/" + id);
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
//   handleGetCustomer,
//   handleGetCustomers,
//   handleGetEmployee,
//   handleGetEmployees,
//   handleRegisterEmployee,
// };
