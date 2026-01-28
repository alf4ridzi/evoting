import React, { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChartBar,
    faChartPie,
    faArrowLeft,
    faTrophy,
    faUsers,
    faCalendarAlt,
    faClock,
} from "@fortawesome/free-solid-svg-icons";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function PollResults() {
    const [viewMode, setViewMode] = useState("chart");

    const { poll = [], options = [], results = [] } = usePage().props;

    const totalVotes = results?.total_votes || 0;
    const votesPerOption = results?.votes_per_option || {};

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getPercentage = (votes) => {
        if (totalVotes === 0) return 0;
        return ((votes / totalVotes) * 100).toFixed(1);
    };

    const sortedOptions = [...options].sort((a, b) => {
        const votesA = votesPerOption[a.id] || 0;
        const votesB = votesPerOption[b.id] || 0;
        return votesB - votesA;
    });

    const maxVotes = Math.max(...Object.values(votesPerOption), 0);
    const winners = options.filter(
        (option) => votesPerOption[option.id] === maxVotes && maxVotes > 0,
    );

    return (
        <>
            <Head title={`Hasil - ${poll.name}`} />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <Button
                        variant="ghost"
                        onClick={() => window.history.back()}
                        className="mb-4"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        Kembali
                    </Button>

                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">
                            {poll.name}
                        </h1>
                        <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon
                                    icon={faCalendarAlt}
                                    className="text-blue-500"
                                />
                                <span>Mulai: {formatDate(poll.starts_at)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon
                                    icon={faClock}
                                    className="text-red-500"
                                />
                                <span>
                                    Berakhir: {formatDate(poll.ends_at)}
                                </span>
                            </div>
                        </div>
                        <Badge
                            variant={
                                poll.status === "active"
                                    ? "default"
                                    : "secondary"
                            }
                        >
                            Status:{" "}
                            {poll.status === "active" ? "Aktif" : "Ditutup"}
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    <FontAwesomeIcon
                                        icon={faUsers}
                                        className="mr-2"
                                    />
                                    Total Suara
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold text-blue-600">
                                    {totalVotes.toLocaleString("id-ID")}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    <FontAwesomeIcon
                                        icon={faChartBar}
                                        className="mr-2"
                                    />
                                    Jumlah Pilihan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold text-purple-600">
                                    {options.length}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-green-50 to-green-100">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    <FontAwesomeIcon
                                        icon={faTrophy}
                                        className="mr-2"
                                    />
                                    Rata-rata Suara
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold text-green-600">
                                    {options.length > 0
                                        ? Math.round(
                                              totalVotes / options.length,
                                          )
                                        : 0}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {winners.length > 0 && totalVotes > 0 && (
                        <Card className="mb-8 bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-yellow-800">
                                    <FontAwesomeIcon
                                        icon={faTrophy}
                                        className="text-yellow-600 text-2xl"
                                    />
                                    {winners.length > 1
                                        ? "Pemenang (Seri)"
                                        : "Pemenang"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {winners.map((winner) => (
                                        <div
                                            key={winner.id}
                                            className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm"
                                        >
                                            <img
                                                src={winner.image}
                                                alt={winner.name}
                                                className="w-20 h-20 rounded-lg object-cover"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg text-gray-900">
                                                    {winner.name}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {winner.description}
                                                </p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <span className="text-2xl font-bold text-yellow-600">
                                                        {votesPerOption[
                                                            winner.id
                                                        ] || 0}
                                                    </span>
                                                    <span className="text-sm text-gray-600">
                                                        suara
                                                    </span>
                                                    <Badge className="bg-yellow-100 text-yellow-800">
                                                        {getPercentage(
                                                            votesPerOption[
                                                                winner.id
                                                            ],
                                                        )}
                                                        %
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Hasil Voting</CardTitle>
                                <div className="flex gap-2">
                                    <Button
                                        variant={
                                            viewMode === "chart"
                                                ? "default"
                                                : "outline"
                                        }
                                        size="sm"
                                        onClick={() => setViewMode("chart")}
                                    >
                                        <FontAwesomeIcon
                                            icon={faChartBar}
                                            className="mr-2"
                                        />
                                        Grafik
                                    </Button>
                                    <Button
                                        variant={
                                            viewMode === "table"
                                                ? "default"
                                                : "outline"
                                        }
                                        size="sm"
                                        onClick={() => setViewMode("table")}
                                    >
                                        <FontAwesomeIcon
                                            icon={faChartPie}
                                            className="mr-2"
                                        />
                                        Detail
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {sortedOptions.map((option, index) => {
                                    const votes =
                                        votesPerOption[option.id] || 0;
                                    const percentage = getPercentage(votes);
                                    const isWinner =
                                        winners.some(
                                            (w) => w.id === option.id,
                                        ) && totalVotes > 0;

                                    return (
                                        <div
                                            key={option.id}
                                            className={`p-4 rounded-lg border-2 transition-all ${
                                                isWinner
                                                    ? "bg-yellow-50 border-yellow-300"
                                                    : "bg-white border-gray-200"
                                            }`}
                                        >
                                            <div className="flex items-start gap-4 mb-3">
                                                <div className="flex-shrink-0">
                                                    <div className="relative">
                                                        <img
                                                            src={option.image}
                                                            alt={option.name}
                                                            className="w-16 h-16 rounded-lg object-cover"
                                                        />
                                                        {index === 0 &&
                                                            isWinner && (
                                                                <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                                                                    1
                                                                </div>
                                                            )}
                                                    </div>
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                                                                {option.name}
                                                                {isWinner && (
                                                                    <FontAwesomeIcon
                                                                        icon={
                                                                            faTrophy
                                                                        }
                                                                        className="text-yellow-500"
                                                                    />
                                                                )}
                                                            </h3>
                                                            {option.description && (
                                                                <p className="text-sm text-gray-600 mt-1">
                                                                    {
                                                                        option.description
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-2xl font-bold text-gray-900">
                                                                {votes.toLocaleString(
                                                                    "id-ID",
                                                                )}
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                suara
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="font-medium text-gray-700">
                                                                Persentase
                                                            </span>
                                                            <span className="font-bold text-blue-600">
                                                                {percentage}%
                                                            </span>
                                                        </div>
                                                        <Progress
                                                            value={parseFloat(
                                                                percentage,
                                                            )}
                                                            className="h-3"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {totalVotes === 0 && (
                                <div className="text-center py-12 text-gray-500">
                                    <FontAwesomeIcon
                                        icon={faChartBar}
                                        className="text-6xl mb-4 text-gray-300"
                                    />
                                    <p className="text-lg">
                                        Belum ada suara masuk
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
