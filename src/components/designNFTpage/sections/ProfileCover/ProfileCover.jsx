import React from "react";
// import cover from "./../../../../images/cover-image.jpg";

function ProfileCover() {
  return (
    <div className="h-60 w-full">
      <img
        src="https://picsum.photos/seed/picsum/200/300"
        alt="cover"
        className="w-full h-full object-cover object-center"
      />
    </div>
  );
}

export default ProfileCover;
