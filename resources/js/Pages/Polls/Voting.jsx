import React, { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheckCircle,
    faClock,
    faCalendarAlt,
    faChartBar,
    faVoteYea,
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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PollVoting() {
    const [selectedOption, setSelectedOption] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        poll = [],
        options = [],
        userVote = null,
        results = [],
    } = usePage().props;

    console.log(poll, options);

    const hasVoted = userVote !== null;
    const isPollActive = poll.status === "active";
    const hasStarted = new Date(poll.starts_at) <= new Date();
    const hasEnded = new Date(poll.ends_at) <= new Date();

    const totalVotes = results?.total_votes || 0;

    const handleVote = () => {
        if (!selectedOption || !isPollActive || !hasStarted || hasEnded) return;

        setIsSubmitting(true);
        router.post(
            `/polls/${poll.poll_id}/vote`,
            {
                poll_option_id: selectedOption,
            },
            {
                onFinish: () => setIsSubmitting(false),
            },
        );
    };

    const getPercentage = (votes) => {
        if (totalVotes === 0) return 0;
        return ((votes / totalVotes) * 100).toFixed(1);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <>
            <Head title={poll.name} />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">
                            {poll.name}
                        </h1>
                        <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
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
                        <div className="mt-3">
                            <Badge
                                variant={
                                    isPollActive && hasStarted && !hasEnded
                                        ? "default"
                                        : "secondary"
                                }
                            >
                                {!hasStarted
                                    ? "Belum Dimulai"
                                    : hasEnded
                                      ? "Telah Berakhir"
                                      : isPollActive
                                        ? "Aktif"
                                        : "Ditutup"}
                            </Badge>
                        </div>
                    </div>

                    {hasVoted && (
                        <Alert className="mb-6 bg-green-50 border-green-200">
                            <FontAwesomeIcon
                                icon={faCheckCircle}
                                className="text-green-600 mr-2"
                            />
                            <AlertDescription className="text-green-800">
                                Terima kasih! Suara Anda telah tercatat.
                            </AlertDescription>
                        </Alert>
                    )}

                    {!hasStarted && (
                        <Alert className="mb-6 bg-yellow-50 border-yellow-200">
                            <FontAwesomeIcon
                                icon={faClock}
                                className="text-yellow-600 mr-2"
                            />
                            <AlertDescription className="text-yellow-800">
                                Voting belum dimulai. Silakan kembali pada{" "}
                                {formatDate(poll.starts_at)}.
                            </AlertDescription>
                        </Alert>
                    )}

                    {hasEnded && !hasVoted && (
                        <Alert className="mb-6 bg-red-50 border-red-200">
                            <FontAwesomeIcon
                                icon={faClock}
                                className="text-red-600 mr-2"
                            />
                            <AlertDescription className="text-red-800">
                                Voting telah berakhir pada{" "}
                                {formatDate(poll.ends_at)}.
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="grid gap-4 mb-6">
                        {options.map((option) => {
                            const optionVotes =
                                results?.votes_per_option?.[option.id] || 0;
                            const percentage = getPercentage(optionVotes);
                            const isSelected = selectedOption === option.id;
                            const isUserVote =
                                hasVoted &&
                                userVote?.poll_option_id === option.id;

                            return (
                                <Card
                                    key={option.id}
                                    className={`transition-all duration-200 cursor-pointer hover:shadow-lg ${
                                        isSelected
                                            ? "ring-2 ring-blue-500 shadow-md"
                                            : ""
                                    } ${isUserVote ? "bg-blue-50 border-blue-300" : ""} ${
                                        !isPollActive ||
                                        !hasStarted ||
                                        hasEnded ||
                                        hasVoted
                                            ? "cursor-not-allowed opacity-75"
                                            : ""
                                    }`}
                                    onClick={() => {
                                        if (
                                            isPollActive &&
                                            hasStarted &&
                                            !hasEnded &&
                                            !hasVoted
                                        ) {
                                            setSelectedOption(option.id);
                                        }
                                    }}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                                <img
                                                    src={`/images/${option.image}`}
                                                    alt={option.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                                            {option.name}
                                                            {isUserVote && (
                                                                <Badge
                                                                    variant="default"
                                                                    className="ml-2"
                                                                >
                                                                    <FontAwesomeIcon
                                                                        icon={
                                                                            faCheckCircle
                                                                        }
                                                                        className="mr-1"
                                                                    />
                                                                    Pilihan Anda
                                                                </Badge>
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
                                                    {isSelected &&
                                                        !hasVoted && (
                                                            <FontAwesomeIcon
                                                                icon={
                                                                    faCheckCircle
                                                                }
                                                                className="text-blue-500 text-2xl"
                                                            />
                                                        )}
                                                </div>

                                                {(hasVoted || hasEnded) && (
                                                    <div className="mt-4">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-sm font-medium text-gray-700">
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faChartBar
                                                                    }
                                                                    className="mr-1"
                                                                />
                                                                {optionVotes.toLocaleString(
                                                                    "id-ID",
                                                                )}{" "}
                                                                suara
                                                            </span>
                                                            <span className="text-sm font-bold text-blue-600">
                                                                {percentage}%
                                                            </span>
                                                        </div>
                                                        <Progress
                                                            value={parseFloat(
                                                                percentage,
                                                            )}
                                                            className="h-2"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {!hasVoted && isPollActive && hasStarted && !hasEnded && (
                        <div className="flex justify-center">
                            <Button
                                size="lg"
                                disabled={!selectedOption || isSubmitting}
                                onClick={handleVote}
                                className="px-8 py-6 text-lg"
                            >
                                <FontAwesomeIcon
                                    icon={faVoteYea}
                                    className="mr-2"
                                />
                                {isSubmitting
                                    ? "Mengirim Suara..."
                                    : "Kirim Suara"}
                            </Button>
                        </div>
                    )}

                    {(hasVoted || hasEnded) && (
                        <Card className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FontAwesomeIcon
                                        icon={faChartBar}
                                        className="text-blue-600"
                                    />
                                    Statistik Voting
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                                        <div className="text-3xl font-bold text-blue-600">
                                            {totalVotes.toLocaleString("id-ID")}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">
                                            Total Suara
                                        </div>
                                    </div>
                                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                                        <div className="text-3xl font-bold text-purple-600">
                                            {options.length}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">
                                            Pilihan
                                        </div>
                                    </div>
                                    <div className="text-center p-4 bg-white rounded-lg shadow-sm col-span-2 md:col-span-1">
                                        <div className="text-3xl font-bold text-green-600">
                                            {poll.status === "active"
                                                ? "Aktif"
                                                : "Selesai"}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">
                                            Status
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}
