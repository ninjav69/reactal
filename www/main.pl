#!/usr/bin/perl

use Dancer2;
use Cwd;

set public_dir => path(Cwd::cwd(), 'dist');
set serializer => 'JSON';

get '/' => sub {
    send_file 'index.html';
};

get '/home' => sub {
    return {
        title => 'You need to learn',
        content => "There's much to learn about modern web development."
    };
};

start;
