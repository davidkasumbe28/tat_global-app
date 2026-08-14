"use client";

import AdminOrderDetailsColOne from "@/components/admin/order/order-details/order-details-col-one";
import AdminOrderDetailsColTwo from "@/components/admin/order/order-details/order-details-col-two";
import AdminOrderDetailsHeader from "@/components/admin/order/order-details/order-details-header";
import Error from "@/components/layout/error";
import Loading from "@/components/layout/loading";
import { useTheme } from "@/hooks/use-theme";
import { Manager, Order } from "@/lib/@types/types";
import {
  PaymentMethod,
  PaymentType,
  StatusOrder,
  TransactionType,
} from "@/lib/generated/prisma/enums";
import { handleReadOrder } from "@/lib/handlers/events-handlers/order-events";
import { handleReadManagers } from "@/lib/handlers/events-handlers/user-events";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;
  const { isloading } = useTheme();
  const [order, setOrder] = useState<Order>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  // const [isEditingImage, setIsEditingImage] = useState(false);
  const [success, setSuccess] = useState("");
  const [newTransaction, setNewTransaction] = useState({
    amount: 0,
    method: PaymentMethod.AIRTEL_MONEY,
    type: TransactionType.SALE,
    reference: "",
  });
  // const [uploading, setUploading] = useState(false);
  // const [progress, setProgress] = useState(0);
  // const [preview, setPreview] = useState("");
  // const [selectedFile, setSelectedFile] = useState<File>();
  const [newAdress, setNewAdress] = useState({});

  const [payment, setPayment] = useState<{
    type: PaymentType;
    method: PaymentMethod;
  }>({
    type: PaymentType.IN_ONE_SLICE,
    method: PaymentMethod.AIRTEL_MONEY,
  });
  const [changeData, setChangeData] = useState<Record<string, any>>({});
  const [formData, setFormData] = useState<Record<string, any>>({
    // name: order?.name,
    // category: order?.category,
    // description: order?.description,
    // image: order?.image,
    // color: order?.color,
    // state: order?.state,
  });
  const [managers, setManagers] = useState<Manager[]>([]);

  const handleShippingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setNewAdress((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (id: number) => {
    // setLoading(true);

    //   const res = await handleDeleteorder(id);

    //   if (res.error) {
    //     setError(res.error);
    //     setLoading(false);
    //     return;
    //   }

    // setSuccess("success");
    // setLoading(false);
  };


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setChangeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeTransaction = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    // const res = await handleDeleteorder(id);

    // if (res.error) {
    //   setError(res.error);
    //   setLoading(false);
    //   return;
    // }

    setSuccess("success");
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // const { name, category, description, color, state } = formData;

    // if (
    //   name == order?.name &&
    //   category == order?.category &&
    //   description == order?.description &&
    //   color == order?.color &&
    //   state == order?.state
    // )
    //   return;

    // setError("");
    // setLoading(true);
    // setSuccess("");

    // // Validation
    // for (const field of Object.keys(changeData)) {
    //   if (field !== "description")
    //     if (!changeData[field]) {
    //       setError("Veuillez remplir tous les champs");
    //       setLoading(false);
    //       break;
    //     }
    // }

    // if (changeData?.description?.length < 10) {
    //   setError("La description doit avoir plus de 10 caractères");
    //   setLoading(false);
    //   return;
    // }

    // const res = await handleUpdateorder(
    //   parseInt(orderId),
    //   changeData,
    // );

    // if (res.error) {
    //   setError(res.error || "Une erreur est survenue lors de la mise à jour");
    //   setLoading(false);
    //   return;
    // }

    // const message = "Mise à jour de la order : " + order?.name;

    // setSuccess(message);
    setIsEditing(false);
    setLoading(false);
  };

  // Fetch order
  useEffect(() => {
    setLoading(true);
    handleReadOrder(parseInt(orderId))
      .then((res) => {
        if (res.error) {
          setError(
            res.error || "Une erreur est survenue lors de la récupération",
          );
          setLoading(false);
          return;
        }
        setOrder(res.data);
        setNewTransaction((prev) => ({
          ...prev,
          amount:
            res?.data?.paymentType == PaymentType.IN_TWO_SLICES
              ? res?.data?.totalAmount / 2
              : res?.data?.totalAmount,
        }));
        setFormData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [success, isEditing]);

  // Fetch Managers if order status -> IN_PREPARATION
  useEffect(() => {
    // if (order?.status !== StatusOrder.IN_PREPARATION) return;
    setLoading(true);
    handleReadManagers("ALL", "ALL")
      .then((res) => {
        if (res.error) {
          setError(
            res.error || "Une erreur est survenue lors de la récupération",
          );
          setLoading(false);
          return;
        }
        setManagers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [success]);

  if (loading) return <Loading subject="de la commande" />;

  if (!order && !loading)
    return (
      <Error
        error={error || "Aucune information disponible sur cette commande."}
      />
    );

  return (
    <main className="flex-1 space-y-2">
      {/* Header */}
      <AdminOrderDetailsHeader
        order={order}
        handleUpdate={handleUpdate}
        handleShippingChange={handleShippingChange}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        emuted={isloading}
        loading={loading}
        payment={payment}
        setPayment={setPayment}
        newAdress={newAdress}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Col One */}
        <AdminOrderDetailsColOne
          order={order}
          emuted={isloading}
          loading={loading}
        />

        {/* Col Two */}
        <AdminOrderDetailsColTwo
          order={order}
          managers={managers}
          emuted={isloading}
          newTransaction={newTransaction}
          handleChangeTransaction={handleChangeTransaction}
          setError={setError}
          setSuccess={setSuccess}
          setLoading={setLoading}
          loading={loading}
        />
      </div>

      {/* More informations */}
      {/* {!isEditing && (
        <AdminorderDetailsMoreDetail
          order={order}
          handleDelete={handleDelete}
          emuted={isloading}
          loading={loading}
        />
      )} */}
    </main>
  );
}
