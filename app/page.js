'use client'
import React, { useEffect, useState } from 'react'
import Inputurl from './components/Inputurl'
import Urllist from './components/Urllist'

const Page = () => {
  const [links, setLinks] = useState([]);

  const fetchLinks = async () => {
    const res = await fetch("/api/links", { cache: "no-store" });
    const data = await res.json();
    setLinks(data);
  };

  useEffect(() => {
    fetchLinks();    // Load once
  }, []);

  return (
    <div className="flex flex-col justify-center">
      <Inputurl onSuccess={fetchLinks} />
      <Urllist links={links} refresh={fetchLinks} setLinks={setLinks} />
    </div>
  );
}

export default Page;
