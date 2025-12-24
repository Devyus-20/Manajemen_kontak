<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class contact extends Model
{
    //data array table
    use HasFactory;

     

    protected $fillable = [
        'nama',
        'telepon',
        'email',
        'foto_profil',
        'lokasi',
    ];
}
