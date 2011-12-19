#!/usr/bin/perl

# Make a smaller image
# generate html page for that image
# make a thumbnail
# add thumbnail to table entry

use strict;
use Image::Magick;

my($image, $chunk, $imgwidth, $imgheight, $row, $col);
my($cutwidth, $cutheight, $counter);
my $file;
my $i;
my $numimgs;
my $curimg;
my ($htmlfile, $prevhtmlfile, $nexthtmlfile);
my ($small_max, $smallwidth, $smallheight);
my ($tn_max, $tnwidth, $tnheight);
my $tn_rows;
my $tn_border;


#$small_max = 450;
#$tn_max = 150;
$small_max = 600;
$tn_max = 200;
$tn_border = $tn_max + 6;
#$tn_rows = 5;
$tn_rows = 4;
$numimgs = $#ARGV + 1;
$curimg = 0;

open(TNPAGE, ">index.html") || die("index.html");

# write the html header stuff for the thumbnail file
print TNPAGE "<html>\n<head>\n<title>\n</title>\n</head>\n";
print TNPAGE "<body bgcolor=#000000 text=#ffffff>\n";
print TNPAGE "<center><h3>Click on thumbnails for images</h3></center>\n";
print TNPAGE "<center>\n<table border=5 cellpadding=5 bgcolor=#ffffff>\n";

$i = 0;
$htmlfile = 0;
$prevhtmlfile = -1;
$nexthtmlfile = 1;
foreach $file (@ARGV)
{
	print "$file\n";

	$curimg++;

	# make the small image
	$image = Image::Magick->new;
	$image->Read($file);
	$imgwidth = $image->Get('width');
	$imgheight = $image->Get('height');

	if($imgwidth < $imgheight)
	{
		$smallheight = $small_max;
		$smallwidth = int(($smallheight/$imgheight) * $imgwidth);

		$tnheight = $tn_max;
		$tnwidth = int(($tnheight/$imgheight) * $imgwidth);
	}
	else
	{
		$smallwidth = $small_max;
		$smallheight = int(($smallwidth/$imgwidth) * $imgheight);

		$tnwidth = $tn_max;
		$tnheight = int(($tnwidth/$imgwidth) * $imgheight);
	}

	$image->Scale(width=>$smallwidth, height=>$smallheight);
	$image->Write("s_$file");

	# make the thumbnail
	$image->Scale(width=>$tnwidth, height=>$tnheight);
	$image->Write("tn_$file");

	# print the table entry for that thumbnail
	print TNPAGE "<td align=center width=$tn_border height=$tn_border><A HREF=\"$htmlfile.html\"><IMG SRC=\"tn_$file\" width=$tnwidth height=$tnheight></A></TD>\n";

	$i++;
	if($i == $tn_rows)
	{
		print TNPAGE "<tr>\n";
		$i = 0;
	}

	# generate the clickable html file for that image
	open(HTMLFILE, ">$htmlfile.html");
	print HTMLFILE "<html>\n<head>\n<title>\n</title>\n</head>\n";
	print HTMLFILE "<body bgcolor=#000000 text=#ffffff link=#00ff00 vlink=#00ffff>\n";
	print HTMLFILE "<center>\n<h3>Click on picture for high res image</h3><br><br><br><a href=\"$file\"><img src=\"s_$file\" width=$smallwidth height=$smallheight></a>\n</center>\n";

	print HTMLFILE "<br><br><br>\n<center>\n";
	if($htmlfile > 0)
	{
		print HTMLFILE "<A HREF=\"$prevhtmlfile.html\">Previous</A>";
	}

	print HTMLFILE " || <A HREF=\"index.html\">Thumbnails</A> ||\n";

	if($curimg < $numimgs)
	{
		print HTMLFILE "<A HREF=\"$nexthtmlfile.html\">Next</A>";
	}

	print HTMLFILE "</center>\n";

	print HTMLFILE "</body>\n</html>\n";
	close(HTMLFILE);

	$htmlfile++;
	$prevhtmlfile++;
	$nexthtmlfile++;
}

# write the closing html info for the thumbnail file
print TNPAGE "</table>\n</center>\n";
print TNPAGE "</body>\n</html>\n";

close(TNPAGE);
