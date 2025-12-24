import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import{Toaster, toast} from "sonner";
import { error } from "console";

interface Contact {
    id?: number;
    nama: string;
    telepon: string;
    email: string;
    foto_profil?: string;
    lokasi: string;
}

interface Props {
    buka: boolean;
    closeModal: () => void;
    contact?: Contact | null;
}

export default function ContactFormModal({ buka, closeModal, contact }: Props) {
    const [formData, setFormData] = useState<Contact>({
        nama: "",
        telepon: "",
        email: "",
        lokasi: "",
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>("");
    const [loadingLokasi, setLoadingLokasi] = useState(false);


    /**  ISI FORM SAAT MODE EDIT */
    useEffect(() => {
        if (contact) {
            setFormData({
                nama: contact.nama,
                telepon: contact.telepon,
                email: contact.email,
                lokasi: contact.lokasi,
            });
            setPreview(contact.foto_profil || "");
        } else {
            setFormData({
                nama: "",
                telepon: "",
                email: "",
                lokasi: "",
            });
            setPreview("");
            setSelectedFile(null);
        }
    }, [contact, buka]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // code ini untuk handle input form
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // code untuk handle data saat disimpan ke database 
        const data = new FormData();
        data.append("nama", formData.nama);
        data.append("telepon", formData.telepon);
        data.append("email", formData.email);
        data.append("lokasi", formData.lokasi);

        if (selectedFile) {
            data.append("foto_profil", selectedFile);
        }

        const pesanSukses = contact?.id? "Data Sukses Diupdate":"Data Sukes Ditambahkan";
        const pesanGagal = contact?.id? "Data gagal Diupdate":"Data gagal Ditambahkan";

        // penkondisian submit
        if (contact?.id) {
            data.append("_method", "PUT");
            router.post(`/contact/${contact.id}`, data, {
                onSuccess: () => {
                        toast.success(pesanSukses);
                    closeModal();
                    router.reload();
                },
                onError:(error)=>{
                    toast.error(pesanGagal);
                 console.error(error.message||"Gagal Kirim Data");
                },
            });
        } else {
            router.post("/contact", data, {
                onSuccess: () => {
                     toast.success(pesanSukses);
                    closeModal();
                    router.reload();
                },
                onError:(error)=>{
                    toast.error(pesanGagal);
                 console.error(error.message||"Gagal Kirim Data");
                },
            });
        }
    };
    const ambilLokasi = () => {
        if (!navigator.geolocation) {
            alert("Browser tidak mendukung GPS");
            return;
        }
    
        setLoadingLokasi(true);
    
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
    
                setFormData((prev) => ({
                    ...prev,
                    lokasi: `${lat}, ${lng}`,
                }));
    
                setLoadingLokasi(false);
            },
            (error) => {
                alert("Gagal mengambil lokasi");
                console.error(error);
                setLoadingLokasi(false);
            }
        );
    };

    if (!buka) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg w-full max-w-xl">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <h2 className="text-lg font-semibold mb-4 text-blue-600">
                        {contact?.id ? "Edit Contact" : "Add Contact"}
                    </h2>

                    <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                        <input
                            type="text"
                            name="nama"
                            value={formData.nama}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                        <input
                            type="tel"
                            name="telepon"
                            value={formData.telepon}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Foto Profil</label>
                        <input type="file" onChange={handleFileChange} accept="image/*" />
                    </div>

                    <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Lokasi (Latitude, Longitude)
                        </label>

                        <textarea
                            name="lokasi"
                            value={formData.lokasi}
                            onChange={handleChange}
                            className="w-full border p-2 rounded mb-2"
                            placeholder="-6.732, 108.552"
                            required
                        />

                        <button
                            type="button"
                            onClick={ambilLokasi}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                            disabled={loadingLokasi}
                        >
                            {loadingLokasi ? "Mengambil lokasi..." : "📍 Ambil Lokasi Otomatis"}
                        </button>
                    </div>


                    {preview && (
                        <img src={preview} className="w-24 h-24 object-cover rounded mb-3" />
                    )}

                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={closeModal} className="bg-gray-500 px-4 py-2 text-white rounded">
                            Batal
                        </button>
                        <button type="submit" className="bg-blue-600 px-4 py-2 text-white rounded">
                            {contact?.id ? "Ubah" : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
