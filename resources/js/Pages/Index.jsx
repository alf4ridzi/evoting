import React, { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowRight,
    faSignInAlt,
    faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchIndex() {
    const { flash } = usePage().props;

    const [pollingId, setPollingId] = useState("");
    const [error, setError] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();

        if (!pollingId.trim()) {
            setError("Polling ID wajib diisi");
            return;
        }

        setError(null);

        router.get(
            route("polls.show", pollingId),
            {},
            {
                onError: () => {
                    setError("Polling tidak ditemukan");
                },
            },
        );
    };

    return (
        <div className="min-h-screen flex flex-col bg-white relative">
            <div className="absolute top-6 right-6 flex gap-3">
                <Button asChild variant="outline" className="rounded-full px-6">
                    <Link href={route("login")}>
                        <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                        Login
                    </Link>
                </Button>

                <Button asChild variant="outline" className="rounded-full px-6">
                    <Link href={route("register")}>
                        <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                        Register
                    </Link>
                </Button>
            </div>

            <div className="flex flex-col flex-1 items-center justify-center">
                <h1 className="mb-8 text-6xl font-bold text-gray-800">
                    Polling
                </h1>

                <form onSubmit={handleSearch} className="w-full max-w-2xl px-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <Input
                                    type="text"
                                    placeholder="Masukkan Polling ID"
                                    value={pollingId}
                                    onChange={(e) => {
                                        setPollingId(e.target.value);
                                        setError(null);
                                    }}
                                    className={`pl-4 py-6 text-lg rounded-full ${
                                        error
                                            ? "border-red-500 focus:border-red-500"
                                            : ""
                                    }`}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="rounded-full px-6 py-6"
                                disabled={!pollingId.trim()}
                            >
                                <FontAwesomeIcon icon={faArrowRight} />
                            </Button>
                        </div>

                        {(error || flash?.error) && (
                            <p className="text-sm text-red-500 ml-4">
                                {error || flash.error}
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
