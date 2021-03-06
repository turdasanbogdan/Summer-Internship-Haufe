import React, { useState } from "react";

import ClientFilterArea from "../components/ClientFilterArea";
import ClientsView from "../components/ClientsView";

function ClientsPage(props) {
  const [searchField, setSearchField] = useState("");

  const onSearchChange = (event) => {
    setSearchField(event.target.value);
  };

  return (
    <>
      <div className="bg-light">
        <ClientFilterArea
          searchValue={searchField}
          onSearchChange={onSearchChange}
        />
        <br />
        <ClientsView />
      </div>
    </>
  );
}

export default ClientsPage;
