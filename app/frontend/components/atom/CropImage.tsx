import React, { useState } from "react";
import { AspectRatio, Cropper } from "react-advanced-cropper";
import { quantico } from "@/models/Font/FontModel";
import "react-advanced-cropper/dist/style.css";
import PlayerProfile from "@/models/User/PlayerProfile/PlayerProfile";
import { useAppDispatch } from "@/app/store/hooks";
import { setNewAvatarSrc } from "@/app/store/features/User/UserSlice";
import { useUpdateAvatarMutation } from "@/app/store/features/User/user.api.slice";

interface CropDemoProps {
  src: string;
  user: PlayerProfile;
  onCLose: Function;
}

export default function CropImage({ src, user, onCLose }: CropDemoProps) {
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const onCropChange = (newCrop: any) => {
    setCroppedImage(newCrop.getCanvas()?.toDataURL());
  };
  const [updateAvatar] = useUpdateAvatarMutation();

  const handleConfirmCrop = (event: any) => {
    if (croppedImage) {
      const response = updateAvatar({userId: user.id, newAvatar: croppedImage});
      dispatch(setNewAvatarSrc(croppedImage));
      onCLose();
    }
  };

  console.log(src);
  return (
    <div className="flex flex-col items-center space-y-5 mb-14">
      <div className=" w-fit max-w-[880px] h-[336px] flex flex-col md">
        <Cropper
          src={src}
          aspectRatio={1 as unknown as AspectRatio}
          onInteractionEnd={onCropChange}
          style={{
            width: "auto",
            height: "400px",
            borderRadius: "25px",
          }}
        />
      </div>
      <button
        className={`bg-gradient-to-r from-indigo-800 to-fuchsia-800 text-white rounded-full p-2 px-28 ${quantico.className} active:scale-95 hover:shadow-lg `}
        onClick={handleConfirmCrop}
      >
        Confirmer le rognage
      </button>
    </div>
  );
}
