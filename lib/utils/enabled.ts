import { StatusUser } from "@/lib/@types/types";

function status(
  currentStatus: StatusUser,
  pageStatus: StatusUser[] | StatusUser | "all",
) {
  if (pageStatus == "all") return true;

  if (!Array.isArray(pageStatus)) {
    pageStatus = [pageStatus as StatusUser];

    return pageStatus.includes(currentStatus);
  }
  return pageStatus.includes(currentStatus);
}

const enabled = {
  status,
};

export default enabled;
