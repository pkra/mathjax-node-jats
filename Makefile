getXML:
	bash -c "find './xml/data/' -type f -name 'b*.xml' -exec cp {} . \;"
process:
	bash regenerate_samples.sh
