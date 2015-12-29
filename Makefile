getXML:
	bash -c "find data/ -type f -name 'b*.xml' -exec cp {} . \;"
process:
	bash regenerate_samples.sh
