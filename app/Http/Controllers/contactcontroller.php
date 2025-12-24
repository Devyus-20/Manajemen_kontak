<?php

namespace App\Http\Controllers;
#memanggil react

use App\Models\contact;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class contactcontroller extends Controller
{
    //
    public function index(): Response
    {
        return Inertia::render('contact', [
            'contact'=> contact ::all(),
        ]);
    }
    // method untuk kirim data ke database
    public function store(Request $request){
        // validasi inputan
        $request->validate([
            'nama' => 'required|string|max:255',
            'telepon' => 'required|string|max:20',
            'email' => 'required|email',
            'foto_profil'=> 'nullable|image|max:2048',
            'lokasi' => 'required|string|max:255',
        ]);
        // ambil data
        $data = $request->only(['nama','telepon','email','lokasi']);

        if($request->hasFile('foto_profil')){
            $file =$request->file('foto_profil');
            $filename = time() .'_'.$file->getClientOriginalName();
            // Simpan di directory pabrik storage
            $path = $file->storeAs('uploads',$filename,'public');
            $data['foto_profil'] ='/storage/' . $path;
        }
        contact::create($data);

        return redirect()->route('contact.index')->with('succes', 'data berhasil disimpan');
    }
    public function update(Request $request, contact $contact)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'telepon' => 'required|string|max:20',
            'email' => 'required|email',
            'foto_profil'=> 'nullable|image|max:2048',
            'lokasi' => 'required|string|max:255',
        ]);
        // ambil data
        $data = $request->only(['nama','telepon','email','lokasi']);

        if($request->hasFile('foto_profil')){
            $file =$request->file('foto_profil');
            $filename = time() .'_'.$file->getClientOriginalName();
            // Simpan di directory pabrik storage
            $path = $file->storeAs('uploads',$filename,'public');
            $data['foto_profil'] ='/storage/' . $path;
        };

        $contact->update($data);

        return redirect()->route('contact.index')->with('succes', 'data berhasil diubah');
    }
    public function destroy(contact $contact){
        $contact->delete();

        return redirect()->route('contact.index')->with('succes', 'data berhasil dihapus');
    }

}
