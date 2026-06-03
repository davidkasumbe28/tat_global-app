
async function handleUploadImage(
  file: File,
  setProgress: React.Dispatch<React.SetStateAction<number>>,
  setUploading: React.Dispatch<React.SetStateAction<boolean>>,
  inputRef: React.RefObject<HTMLInputElement | null>,
  setError: React.Dispatch<React.SetStateAction<string>>
): Promise<Record<string, any>> {

  try {
    // Reset état de progression
    setProgress(0);

    const xhr = new XMLHttpRequest();
    const form = new FormData();
    form.append("file", file);

    // Suivi de progression
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };

    xhr.onload = () => {
      setUploading(false);
      setProgress(100);

      try {
        const res = JSON.parse(xhr.responseText);
        console.log("Upload response data:", res);
        return res as Record<string, any>;
      } catch (err) {
        console.error("Erreur parsing JSON:", err);
        setError("Erreur lors de l'analyse de la réponse du serveur");
      }

      if (inputRef.current) inputRef.current.value = "";
    };

    xhr.onerror = () => {
      console.error("Upload failed");
      setError("Échec de l'upload de l'avatar");
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    };

    xhr.open("POST", "/api/auth/upload/avatar");
    xhr.send(form);

    return {} as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

export { handleUploadImage };