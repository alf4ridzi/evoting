import React, { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faClock,
    faCheckCircle,
    faTimesCircle,
    faCalendarAlt,
    faChartLine,
    faVoteYea,
    faSearch,
} from "@fortawesome/free-solid-svg-icons";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function PollsList() {
    const [searchQuery, setSearchQuery] = useState("");
    const { polls = [], auth } = usePage().props;

    const filteredPolls = polls.filter((poll) =>
        poll.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getPollStatus = (poll) => {
        const now = new Date();
        const startsAt = new Date(poll.starts_at);
        const endsAt = new Date(poll.ends_at);

        if (now < startsAt) return "upcoming";
        if (now > endsAt) return "ended";
        if (poll.status === "closed") return "closed";
        return "active";
    };

    const getStatusBadge = (poll) => {
        const status = getPollStatus(poll);

        const statusConfig = {
            active: {
                icon: faCheckCircle,
                text: "Aktif",
                variant: "default",
                color: "text-green-600",
            },
            upcoming: {
                icon: faClock,
                text: "Akan Datang",
                variant: "secondary",
                color: "text-blue-600",
            },
            ended: {
                icon: faTimesCircle,
                text: "Berakhir",
                variant: "secondary",
                color: "text-gray-600",
            },
            closed: {
                icon: faTimesCircle,
                text: "Ditutup",
                variant: "destructive",
                color: "text-red-600",
            },
        };

        const config = statusConfig[status];

        return (
            <Badge variant={config.variant}>
                <FontAwesomeIcon icon={config.icon} className="mr-1" />
                {config.text}
            </Badge>
        );
    };

    return (
        <>
            <Head title="Daftar Voting" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                <FontAwesomeIcon
                                    icon={faVoteYea}
                                    className="mr-3 text-blue-600"
                                />
                                Daftar Voting
                            </h1>
                            <p className="text-gray-600">
                                Pilih voting yang ingin Anda ikuti
                            </p>
                        </div>
                        {auth.user && (
                            <Link href="/polls/create">
                                <Button size="lg">
                                    <FontAwesomeIcon
                                        icon={faPlus}
                                        className="mr-2"
                                    />
                                    Buat Voting Baru
                                </Button>
                            </Link>
                        )}
                    </div>

                    <div className="mb-6">
                        <div className="relative max-w-md">
                            <FontAwesomeIcon
                                icon={faSearch}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                            <Input
                                type="text"
                                placeholder="Cari voting..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {filteredPolls.length === 0 ? (
                        <Card className="text-center py-12">
                            <CardContent>
                                <FontAwesomeIcon
                                    icon={faVoteYea}
                                    className="text-6xl text-gray-300 mb-4"
                                />
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                    Tidak ada voting ditemukan
                                </h3>
                                <p className="text-gray-500">
                                    {searchQuery
                                        ? "Coba kata kunci lain"
                                        : "Belum ada voting tersedia"}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPolls.map((poll) => {
                                const status = getPollStatus(poll);
                                const isActive = status === "active";

                                return (
                                    <Card
                                        key={poll.id}
                                        className="hover:shadow-xl transition-all duration-300 flex flex-col"
                                    >
                                        <CardHeader>
                                            <div className="flex items-start justify-between mb-2">
                                                <CardTitle className="text-xl line-clamp-2">
                                                    {poll.name}
                                                </CardTitle>
                                                {getStatusBadge(poll)}
                                            </div>
                                            <CardDescription>
                                                Dibuat oleh{" "}
                                                {poll.created_by?.name ||
                                                    "Admin"}
                                            </CardDescription>
                                        </CardHeader>

                                        <CardContent className="flex-1">
                                            <div className="space-y-3">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <FontAwesomeIcon
                                                        icon={faCalendarAlt}
                                                        className="mr-2 text-blue-500"
                                                    />
                                                    <div>
                                                        <div>
                                                            Mulai:{" "}
                                                            {formatDate(
                                                                poll.starts_at,
                                                            )}
                                                        </div>
                                                        <div>
                                                            Selesai:{" "}
                                                            {formatDate(
                                                                poll.ends_at,
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {poll.total_votes !==
                                                    undefined && (
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <FontAwesomeIcon
                                                            icon={faChartLine}
                                                            className="mr-2 text-purple-500"
                                                        />
                                                        <span>
                                                            {poll.total_votes}{" "}
                                                            suara
                                                        </span>
                                                    </div>
                                                )}

                                                {poll.options_count !==
                                                    undefined && (
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <FontAwesomeIcon
                                                            icon={faVoteYea}
                                                            className="mr-2 text-green-500"
                                                        />
                                                        <span>
                                                            {poll.options_count}{" "}
                                                            pilihan
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>

                                        <CardFooter>
                                            <Link
                                                href={`/v/${poll.poll_id}`}
                                                className="w-full"
                                            >
                                                <Button
                                                    className="w-full"
                                                    variant={
                                                        isActive
                                                            ? "default"
                                                            : "secondary"
                                                    }
                                                >
                                                    {isActive ? (
                                                        <>
                                                            <FontAwesomeIcon
                                                                icon={faVoteYea}
                                                                className="mr-2"
                                                            />
                                                            Ikuti Voting
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FontAwesomeIcon
                                                                icon={
                                                                    faChartLine
                                                                }
                                                                className="mr-2"
                                                            />
                                                            Lihat Hasil
                                                        </>
                                                    )}
                                                </Button>
                                            </Link>
                                        </CardFooter>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
