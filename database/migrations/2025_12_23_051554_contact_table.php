<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        //code untuk struktur table contact
        Schema::create( 'contact', function(Blueprint $stable){
            $stable -> id ();
            $stable -> string('nama');
            $stable -> string('telepon');
            $stable -> string('email');
            $stable -> string('foto_profil')->nullable();
            $stable -> string('lokasi');
            $stable -> timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::dropIfExists('contact'); 
    }
};
