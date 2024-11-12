import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import Search from "./Search";
import FileUploader from "./FileUploader";

const Header = () => {
  return (
    <header className="header">
      <Search/>
      <div className="header-wrapper">
        <FileUploader/>
        <form>
          <Button type="button" className="sign-out-button">
            <Image
              src="/assets/icons/logout.svg"
              alt="log"
              width={24}
              height={24}
              className="w-6"
            />
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
