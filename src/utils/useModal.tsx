import {
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
} from "react";

import Modal from "../components/Modal";

interface ModalProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  title: string;
  errorMessage: string;
  type: "error" | "success";
  btnText?: string;
}

const BaseModal = ({
  showModal,
  setShowModal,
  title,
  errorMessage,
  type = "error",
  btnText = "Close",
}: ModalProps) => {
  const handleClose = useCallback(() => {
    setShowModal(false);
  }, [setShowModal]);

  return (
    <Modal showModal={showModal} setShowModal={setShowModal}>
      <div className="w-full overflow-hidden md:max-w-md md:rounded-2xl md:border md:border-gray-100 md:shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 bg-white px-4 py-6 pt-8 text-center md:px-16">
          <h3 className="font-display text-2xl font-bold">{title}</h3>
          <p className="text-sm text-gray-500">{errorMessage}</p>
          <div className="flex w-full flex-col items-center justify-center space-y-3">
            {type === "error" ? (
              <button
                className="w-full rounded-md bg-red-500 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white"
                onClick={handleClose}
              >
                {btnText}
              </button>
            ) : (
              <button
                className="w-full rounded-md bg-primary-500 py-2 text-sm font-medium text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white"
                onClick={handleClose}
              >
                {btnText}
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export function useModal() {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"error" | "success">("error");
  const [message, setMessage] = useState("");

  const ModalCallback = useCallback(() => {
    return (
      <BaseModal
        showModal={showModal}
        setShowModal={setShowModal}
        title={title}
        type={type}
        errorMessage={message}
      />
    );
  }, [showModal, setShowModal, title, message, type]);

  return useMemo(
    () => ({
      showModal,
      setShowModal,
      setTitle,
      setType,
      setMessage,
      Modal: ModalCallback,
    }),
    [showModal, setTitle, setMessage, setType, ModalCallback]
  );
}
