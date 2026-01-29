import React, { useEffect, useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faTrash,
    faImage,
    faSave,
    faArrowLeft,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "react-toastify";

const initialFormData = {
    name: "",
    starts_at: "",
    ends_at: "",
    options: [
        { name: "", description: "", image: null, imagePreview: null },
        { name: "", description: "", image: null, imagePreview: null },
    ],
}

export default function CreatePoll() {
    
    const [formData, setFormData] = useState(initialFormData);

    const { flash, errors } = usePage().props;

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash?.success);
        }
    });
    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleOptionChange = (index, field, value) => {
        const newOptions = [...formData.options];
        newOptions[index][field] = value;
        setFormData((prev) => ({ ...prev, options: newOptions }));
    };

    const handleImageChange = (index, file) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newOptions = [...formData.options];
                newOptions[index].image = file;
                newOptions[index].imagePreview = reader.result;
                setFormData((prev) => ({ ...prev, options: newOptions }));
            };
            reader.readAsDataURL(file);
        }
    };

    const addOption = () => {
        setFormData((prev) => ({
            ...prev,
            options: [
                ...prev.options,
                { name: "", description: "", image: null, imagePreview: null },
            ],
        }));
    };

    const removeOption = (index) => {
        if (formData.options.length > 2) {
            const newOptions = formData.options.filter((_, i) => i !== index);
            setFormData((prev) => ({ ...prev, options: newOptions }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const submitData = new FormData();
        submitData.append("name", formData.name);
        submitData.append("starts_at", formData.starts_at);
        submitData.append("ends_at", formData.ends_at);

        formData.options.forEach((option, index) => {
            submitData.append(`options[${index}][name]`, option.name);
            submitData.append(
                `options[${index}][description]`,
                option.description || "",
            );
            if (option.image) {
                submitData.append(`options[${index}][image]`, option.image);
            }
        });

        router.post(route("polls.store"), submitData, {
            forceFormData: true,
            onFinish: () => {
                setIsSubmitting(false); 
                setFormData(initialFormData)
            },
        });
    };

    return (
        <>
            <Head title="Buat Voting Baru" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <Button
                            variant="ghost"
                            onClick={() => router.visit("/polls")}
                            className="mb-4"
                        >
                            <FontAwesomeIcon
                                icon={faArrowLeft}
                                className="mr-2"
                            />
                            Kembali
                        </Button>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Buat Voting Baru
                        </h1>
                        <p className="text-gray-600">
                            Isi informasi voting dan pilihan yang tersedia
                        </p>
                    </div>

                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertDescription>
                                <ul className="list-disc pl-4">
                                    {Object.values(errors).map(
                                        (error, index) => (
                                            <li key={index}>{error}</li>
                                        ),
                                    )}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Voting</CardTitle>
                                <CardDescription>
                                    Detail umum tentang voting yang akan dibuat
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Nama Voting *</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "name",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Contoh: Pilih Ketua OSIS 2025"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="starts_at">
                                            Waktu Mulai *
                                        </Label>
                                        <Input
                                            id="starts_at"
                                            type="datetime-local"
                                            value={formData.starts_at}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "starts_at",
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="ends_at">
                                            Waktu Berakhir *
                                        </Label>
                                        <Input
                                            id="ends_at"
                                            type="datetime-local"
                                            value={formData.ends_at}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "ends_at",
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Pilihan Voting
                                </h2>
                                <Button
                                    type="button"
                                    onClick={addOption}
                                    variant="outline"
                                >
                                    <FontAwesomeIcon
                                        icon={faPlus}
                                        className="mr-2"
                                    />
                                    Tambah Pilihan
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {formData.options.map((option, index) => (
                                    <Card key={index}>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <CardTitle>
                                                    Pilihan {index + 1}
                                                </CardTitle>
                                                {formData.options.length >
                                                    2 && (
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() =>
                                                            removeOption(index)
                                                        }
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faTrash}
                                                        />
                                                    </Button>
                                                )}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <Label
                                                    htmlFor={`option-name-${index}`}
                                                >
                                                    Nama Pilihan *
                                                </Label>
                                                <Input
                                                    id={`option-name-${index}`}
                                                    type="text"
                                                    value={option.name}
                                                    onChange={(e) =>
                                                        handleOptionChange(
                                                            index,
                                                            "name",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Contoh: Ahmad Yusuf"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <Label
                                                    htmlFor={`option-description-${index}`}
                                                >
                                                    Deskripsi
                                                </Label>
                                                <Textarea
                                                    id={`option-description-${index}`}
                                                    value={option.description}
                                                    onChange={(e) =>
                                                        handleOptionChange(
                                                            index,
                                                            "description",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Deskripsi singkat tentang pilihan ini..."
                                                    rows={3}
                                                />
                                            </div>

                                            <div>
                                                <Label
                                                    htmlFor={`option-image-${index}`}
                                                >
                                                    Gambar *
                                                </Label>
                                                <div className="mt-2">
                                                    {option.imagePreview ? (
                                                        <div className="relative inline-block">
                                                            <img
                                                                src={
                                                                    option.imagePreview
                                                                }
                                                                alt={
                                                                    option.name
                                                                }
                                                                className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="destructive"
                                                                size="sm"
                                                                className="absolute -top-2 -right-2"
                                                                onClick={() =>
                                                                    handleOptionChange(
                                                                        index,
                                                                        "imagePreview",
                                                                        null,
                                                                    )
                                                                }
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faTrash
                                                                    }
                                                                />
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <label
                                                            htmlFor={`option-image-${index}`}
                                                            className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
                                                        >
                                                            <div className="text-center">
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faImage
                                                                    }
                                                                    className="text-3xl text-gray-400 mb-2"
                                                                />
                                                                <span className="text-xs text-gray-500">
                                                                    Upload
                                                                    Gambar
                                                                </span>
                                                            </div>
                                                        </label>
                                                    )}
                                                    <Input
                                                        id={`option-image-${index}`}
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) =>
                                                            handleImageChange(
                                                                index,
                                                                e.target
                                                                    .files[0],
                                                            )
                                                        }
                                                        required={
                                                            !option.imagePreview
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.visit("/polls")}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                size="lg"
                            >
                                <FontAwesomeIcon
                                    icon={faSave}
                                    className="mr-2"
                                />
                                {isSubmitting
                                    ? "Menyimpan..."
                                    : "Simpan Voting"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
