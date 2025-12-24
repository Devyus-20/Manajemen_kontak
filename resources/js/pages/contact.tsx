import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import ContactFormModal from "@/components/ui/contactform-modal";
import{Toaster, toast} from "sonner";

interface Contact {
    id: number;
    nama: string;
    telepon: string;
    email: string;
    foto_profil?: string;
    lokasi: string;
}

export default function Contact() {

    const { contact: contacts } = usePage<{ contact: Contact[] }>().props;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

    // buka modal (tambah / edit)
    const openModal = (contact: Contact | null = null) => {
        setSelectedContact(contact);
        setIsModalOpen(true);
    };

    // control deleted
    const handleDelete = (id: number)=>{
        router.delete(`/contact/${id}`,{
            onSuccess:()=>{
                    toast.success("Data Berhasil Dihapus")
                router.reload();
            },
            onError:()=>{
                    toast.error("Data Gagal Dihapus")
                console.error("gagal hapus");
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Apps CRUD" />
            <Toaster position="top-right" richColors></Toaster>

            <div className="flex flex-col gap-6 p-6 bg-background text-white shadow-lg rounded-xl">

                <div className="flex justify-end">
                    <button
                        onClick={() => openModal()}
                        className="bg-gray-800 text-white rounded px-3 py-1 text-sm hover:bg-gray-900 transition"
                    >
                        Tambah Data
                    </button>
                </div>

                <table className="w-full rounded bg-background text-white shadow-sm">
                    <thead>
                        <tr className="bg-gray-900">
                            {["ID", "Nama", "Telpon", "Email", "Foto Profil", "Lokasi", "Action"].map((header) => (
                                <th key={header} className="p-3 text-left">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {contacts.length ? (
                            contacts.map((contact) => (
                                <tr key={contact.id} className="border-b border-gray-800">
                                    <td className="p-3">{contact.id}</td>
                                    <td className="p-3">{contact.nama}</td>
                                    <td className="p-3">{contact.telepon}</td>
                                    <td className="p-3">{contact.email}</td>
                                    <td className="p-3">
                                        {contact.foto_profil ? (
                                            <img
                                                src={contact.foto_profil}
                                                alt="contact"
                                                className="w-16 h-16 object-cover rounded-full"
                                            />
                                        ) : (
                                            "No Picture"
                                        )}
                                    </td>
                                    <td className="p-3">{contact.lokasi}</td>

                                    <td className="p-3 flex gap-2">
                                        
                                        <button
                                            onClick={() => openModal(contact)}
                                            className="bg-blue-500 text-sm text-white px-3 py-1 rounded"
                                        >
                                            Edit
                                        </button>

                                        <button 
                                            onClick={() => handleDelete(contact.id)}
                                            className="bg-red-500 text-sm text-white px-3 py-1 rounded">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="text-center p-4 text-gray-400">
                                    Belum Ada Data
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <ContactFormModal
                buka={isModalOpen}
                closeModal={() => setIsModalOpen(false)}
                contact={selectedContact}
            />
        </AppLayout>
    );
}
