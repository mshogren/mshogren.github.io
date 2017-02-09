task :default => [:build]

task :build do
  sh "bundle exec jekyll build"
end

task :test do 
  HTML::Proofer.new("./_site", {:allow_hash_href => true, :check_html => true, :check_external_hash => true}).run
end
