import React, { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faEdit,
    faTrash,
    faEye,
    faLink,
    faChartBar,
    faClock,
    faCheckCircle,
    faTimesCircle,
    faCopy,
    faArrowRightFromBracket,
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
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PollsDashboard() {
    const [copiedId, setCopiedId] = useState(null);

    const { polls = [] } = usePage().props;

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

    const handleLogout = () => {
        router.post(route("logout"));
    };

    const getStatusBadge = (poll) => {
        const status = getPollStatus(poll);

        const statusConfig = {
            active: { icon: faCheckCircle, text: "Aktif", variant: "default" },
            upcoming: {
                icon: faClock,
                text: "Akan Datang",
                variant: "secondary",
            },
            ended: {
                icon: faTimesCircle,
                text: "Berakhir",
                variant: "secondary",
            },
            closed: {
                icon: faTimesCircle,
                text: "Ditutup",
                variant: "destructive",
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

    const handleDelete = (pollId, pollName) => {
        if (
            confirm(`Apakah Anda yakin ingin menghapus voting "${pollName}"?`)
        ) {
            router.delete(`/polls/${pollId}`);
        }
    };

    const handleToggleStatus = (pollId, currentStatus) => {
        const newStatus = currentStatus === "active" ? "closed" : "active";
        router.patch(`/polls/${pollId}/status`, { status: newStatus });
    };

    const copyPollLink = (pollId) => {
        const link = `${window.location.origin}/polls/${pollId}`;
        navigator.clipboard.writeText(link).then(() => {
            setCopiedId(pollId);
            setTimeout(() => setCopiedId(null), 2000);
        });
    };

    return (
        <>
            <Head title="Dashboard Voting" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                Dashboard Voting Saya
                            </h1>
                            <p className="text-gray-600">
                                Kelola semua voting yang Anda buat
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link href={route("polls.create")}>
                                <Button size="lg">
                                    <FontAwesomeIcon
                                        icon={faPlus}
                                        className="mr-2"
                                    />
                                    Buat Voting Baru
                                </Button>
                            </Link>

                            <Button
                                size="lg"
                                onClick={handleLogout}
                                variant="destructive"
                            >
                                <FontAwesomeIcon
                                    icon={faArrowRightFromBracket}
                                ></FontAwesomeIcon>
                                Logout
                            </Button>
                        </div>
                    </div>

                    {copiedId && (
                        <Alert className="mb-6 bg-green-50 border-green-200">
                            <FontAwesomeIcon
                                icon={faCheckCircle}
                                className="text-green-600 mr-2"
                            />
                            <AlertDescription className="text-green-800">
                                Link berhasil disalin ke clipboard!
                            </AlertDescription>
                        </Alert>
                    )}

                    {polls.length === 0 ? (
                        <Card className="text-center py-12">
                            <CardContent>
                                <FontAwesomeIcon
                                    icon={faChartBar}
                                    className="text-6xl text-gray-300 mb-4"
                                />
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                    Belum ada voting
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    Buat voting pertama Anda untuk memulai
                                </p>
                                <Link href={route("polls.create")}>
                                    <Button>
                                        <FontAwesomeIcon
                                            icon={faPlus}
                                            className="mr-2"
                                        />
                                        Buat Voting Baru
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {polls.map((poll) => {
                                const status = getPollStatus(poll);

                                return (
                                    <Card
                                        key={poll.id}
                                        className="hover:shadow-lg transition-shadow"
                                    >
                                        <CardHeader>
                                            <div className="flex items-start justify-between mb-2">
                                                <CardTitle className="text-xl line-clamp-2 flex-1">
                                                    {poll.name}
                                                </CardTitle>
                                                {getStatusBadge(poll)}
                                            </div>
                                            <CardDescription className="space-y-1">
                                                <div className="flex items-center gap-2 text-xs">
                                                    <FontAwesomeIcon
                                                        icon={faClock}
                                                        className="text-blue-500"
                                                    />
                                                    <span>
                                                        Mulai:{" "}
                                                        {formatDate(
                                                            poll.starts_at,
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <FontAwesomeIcon
                                                        icon={faClock}
                                                        className="text-red-500"
                                                    />
                                                    <span>
                                                        Selesai:{" "}
                                                        {formatDate(
                                                            poll.ends_at,
                                                        )}
                                                    </span>
                                                </div>
                                            </CardDescription>
                                        </CardHeader>

                                        <CardContent>
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div className="text-center p-3 bg-blue-50 rounded-lg">
                                                    <div className="text-2xl font-bold text-blue-600">
                                                        {poll.total_votes || 0}
                                                    </div>
                                                    <div className="text-xs text-gray-600">
                                                        Suara
                                                    </div>
                                                </div>
                                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                                    <div className="text-2xl font-bold text-green-600">
                                                        {poll.options?.length ||
                                                            0}
                                                    </div>
                                                    <div className="text-xs text-gray-600">
                                                        Opsi
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
                                                <FontAwesomeIcon
                                                    icon={faLink}
                                                    className="text-gray-400"
                                                />
                                                <code className="flex-1 text-xs truncate">
                                                    {window.location.origin}
                                                    /polls/
                                                    {poll.poll_id}
                                                </code>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        copyPollLink(
                                                            poll.poll_id,
                                                        )
                                                    }
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faCopy}
                                                    />
                                                </Button>
                                            </div>
                                        </CardContent>

                                        <CardFooter className="flex gap-2">
                                            <Link
                                                href={`/polls/${poll.poll_id}`}
                                                className="flex-1"
                                            >
                                                <Button
                                                    variant="outline"
                                                    className="w-full"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faEye}
                                                        className="mr-2"
                                                    />
                                                    Lihat
                                                </Button>
                                            </Link>
                                            <Link
                                                href={`/polls/${poll.id}/edit`}
                                                className="flex-1"
                                            >
                                                <Button
                                                    variant="outline"
                                                    className="w-full"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faEdit}
                                                        className="mr-2"
                                                    />
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button
                                                variant={
                                                    poll.status === "active"
                                                        ? "secondary"
                                                        : "default"
                                                }
                                                onClick={() =>
                                                    handleToggleStatus(
                                                        poll.id,
                                                        poll.status,
                                                    )
                                                }
                                            >
                                                {poll.status === "active"
                                                    ? "Tutup"
                                                    : "Aktifkan"}
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={() =>
                                                    handleDelete(
                                                        poll.id,
                                                        poll.name,
                                                    )
                                                }
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                />
                                            </Button>
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
