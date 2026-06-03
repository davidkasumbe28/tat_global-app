"use client";

import { useAuth } from "@/hooks/use-auth";
import { UserMe } from "@/lib/@types/user.type";
import { NotifyOrderBy } from "@/lib/generated/prisma/enums";
import { handleReadProfileUser } from "@/lib/handlers/events-handlers/user-events";
import React, { useEffect, useState } from "react";
import FormCompletionStepFinal from "./form-completion-stepFinal";
import FormCompletionStepOne from "./form-completion-stepOne";
import FormCompletionStepTree from "./form-completion-stepTree";
import FormCompletionStepTwo from "./form-completion-stepTwo";

export default function FormCompletionForm({
  currentPage,
  setCurrentPage,
  setTotalPages,
  emuted = true,
}: {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
  emuted?: boolean;
}) {
  const { isloadingAuth } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");

  const [me, setMe] = useState<UserMe>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
    avatar: "",
    notifyOrderBy: NotifyOrderBy.EMAIL,
    notifyNewsletter: false,
  });

  const [dataProfile, setDataProfile] = useState<
    Record<string, any | undefined>
  >({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [dataAddress, setDataAddress] = useState<
    Record<string, any | undefined>
  >({
    address: "",
    city: "",
    zipCode: "",
    country: "",
  });

  const [dataAvatar, setDataAvatar] = useState<Record<string, any | undefined>>(
    {
      firstName: "",
      lastName: "",
      avatar: "",
      notifyOrderBy: NotifyOrderBy.EMAIL,
      notifyNewsletter: false,
    },
  );

  const isComplete = (data: Record<string, any | undefined>) => {
    return Object.values(data).every((value) => {
      if (typeof value === "string") return value.trim() !== "";
      return value !== undefined && value !== null;
    });
  };

  useEffect(() => {
    setLoading(true);
    handleReadProfileUser()
      .then((res) => {
        if (res.error) {
          setLoading(false);
          return;
        }

        const data = res.data;

        const profile = {
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
        };

        const address = {
          address: data.address,
          city: data.city,
          zipCode: data.zipCode,
          country: data.country,
        };

        const avatar = {
          firstName: data.firstName,
          lastName: data.lastName,
          avatar: data.avatar,
          notifyOrderBy: data.notifyOrderBy,
          notifyNewsletter: data.notifyNewsletter,
        };

        setMe(data);

        setDataProfile(profile);

        setDataAddress(address);

        setDataAvatar(avatar);

        if (isComplete(data)) {
          setTotalPages(4);
          setCurrentPage(4);
          setLoading(false);
        } else if (isComplete(address) && isComplete(profile)) {
          setTotalPages(3);
          setCurrentPage(3);
          setLoading(false);
        } else if (isComplete(profile)) {
          setTotalPages(2);
          setCurrentPage(2);
          setLoading(false);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [success]);

  switch (currentPage) {
    case 1:
      return (
        <FormCompletionStepOne
          isComplete={isComplete(dataProfile)}
          dataProfile={dataProfile}
          setDataProfile={setDataProfile}
          setIsEditing={setIsEditing}
          isEditing={isEditing}
          isloading={isloadingAuth}
          emuted={emuted}
          success={success}
          setSuccess={setSuccess}
          loading={loading}
          setLoading={setLoading}
        />
      );
    case 2:
      return (
        <FormCompletionStepTwo
          isComplete={isComplete(dataAddress)}
          dataAddress={dataAddress}
          setDataAddress={setDataAddress}
          setIsEditing={setIsEditing}
          isEditing={isEditing}
          isloading={isloadingAuth}
          emuted={emuted}
          success={success}
          setSuccess={setSuccess}
          loading={loading}
          setLoading={setLoading}
        />
      );
    case 3:
      return (
        <FormCompletionStepTree
          isComplete={isComplete(dataAvatar)}
          dataAvatar={dataAvatar}
          setIsEditing={setIsEditing}
          isEditing={isEditing}
          isloading={isloadingAuth}
          emuted={emuted}
          success={success}
          setSuccess={setSuccess}
          loading={loading}
          setLoading={setLoading}
        />
      );
    case 4:
      return (
        <FormCompletionStepFinal
          isComplete={isComplete(me)}
          isloading={isloadingAuth}
          emuted={emuted}
        />
      );
  }
}
