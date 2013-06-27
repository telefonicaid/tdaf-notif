class depdb {
  # Install Environment
  ################################
  exec {'epelrepo':
    command => '/bin/rpm -Uvh http://ftp.rediris.es/mirror/fedora-epel/6/i386/epel-release-6-7.noarch.rpm',
    unless => '/usr/bin/yum repolist | /bin/grep epel',
    path => '/root',
  }

  package { 'mongodb-server':
    ensure => installed,
    require => Exec['epelrepo'],
  }

  # Configuration
  ################################
  file { "/etc/mongodb.conf":
    notify => Service['mongod'],
    owner => "root",
    group => "root",
    mode => 644,
    source => "puppet:///modules/${module_name}/mongodb.conf",
  }

  file { "/etc/sysconfig/iptables":
    notify => Service['iptables'],
    owner => "root",
    group => "root",
    mode => 600,
    source => "puppet:///modules/${module_name}/iptables",
  }

  service { 'iptables':
    ensure => "running",
  }

  # Service 
  ################################
  service { 'mongod':
    ensure  => "running",
    enable  => "true",
    require => Package['mongodb-server'],
  }

}
